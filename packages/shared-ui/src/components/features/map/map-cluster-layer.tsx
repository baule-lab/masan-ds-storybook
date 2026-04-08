'use client';

import { useEffect, useId, useState, useMemo, useRef } from 'react';
import type MapLibreGL from 'maplibre-gl';
import { useMap, MapMarker, MarkerContent } from './map';
import { AnimatedPOSMarker, mapBackendStatus } from './animated-pos-marker';

/**
 * Props for MapClusterLayer component
 * @template T - Type of properties attached to GeoJSON features
 */
export interface MapClusterLayerProps<T = Record<string, unknown>> {
  /**
   * GeoJSON data source
   * Can be either a URL string or a FeatureCollection object
   */
  data: string | GeoJSON.FeatureCollection<GeoJSON.Point, T>;

  /**
   * Cluster radius in pixels
   * Points within this radius will be grouped into a cluster
   * @default 50
   */
  clusterRadius?: number;

  /**
   * Maximum zoom level for clustering
   * Beyond this zoom, individual points are always shown
   * @default 14
   */
  clusterMaxZoom?: number;

  /**
   * Colors for clusters (3-tier array)
   * [small clusters, medium clusters, large clusters]
   * Interpolated based on point count
   * @default ['#10b981', '#f59e0b', '#ec4899'] (green, orange, pink)
   */
  clusterColors?: [string, string, string];

  /**
   * Color for individual unclustered points
   * @default '#3b82f6' (blue)
   */
  pointColor?: string;

  /**
   * NEW: Extract status from point properties for coloring
   * @param properties - Point properties
   * @returns POSStatus for color mapping
   */
  getPointStatus?: (properties: T) => 'active' | 'warning' | 'critical';

  /**
   * NEW: Use animated DOM markers for unclustered points
   * Performance note: Only enable for <500 points
   * @default false
   */
  animatedPoints?: boolean;

  /**
   * NEW: Show glow effect on clusters
   * @default true
   */
  clusterGlow?: boolean;

  /**
   * Click handler for cluster markers
   * Receives cluster ID, coordinates, point count, and all properties in the cluster
   */
  onClusterClick?: (
    clusterId: number,
    coordinates: [number, number],
    pointCount: number,
    properties: T[]
  ) => void;

  /**
   * Click handler for individual point markers
   * Receives the full GeoJSON feature and coordinates
   */
  onPointClick?: (
    feature: GeoJSON.Feature<GeoJSON.Point, T>,
    coordinates: [number, number]
  ) => void;
}

/**
 * MapClusterLayer Component
 * Renders clustered markers on a MapLibre GL map
 */
export function MapClusterLayer<T = Record<string, unknown>>({
  data,
  clusterRadius = 50,
  clusterMaxZoom = 14,
  clusterColors = ['#10b981', '#f59e0b', '#ec4899'],
  pointColor = '#3b82f6',
  getPointStatus,
  animatedPoints = false,
  clusterGlow = false,
  onClusterClick,
  onPointClick,
}: MapClusterLayerProps<T>) {
  const { map, isLoaded } = useMap();
  const sourceId = useId();
  const clusterLayerId = `${sourceId}-clusters`;
  const clusterGlowLayerId = `${sourceId}-cluster-glow`;
  const clusterPulseLayerId = `${sourceId}-cluster-pulse`;
  const clusterCountLayerId = `${sourceId}-cluster-count`;
  const pointLayerId = `${sourceId}-points`;
  const [unclusteredPoints, setUnclusteredPoints] = useState<GeoJSON.Feature<GeoJSON.Point, T>[]>(
    []
  );

  // Phase 2 Task 2.1: Add transition state management
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  // Phase 1 Task 2.2: Add requestAnimationFrame debouncing ref
  const updatePointsRef = useRef<number | null>(null);

  useEffect(() => {
    if (!map || !isLoaded) return;

    // Add GeoJSON source with clustering enabled
    map.addSource(sourceId, {
      type: 'geojson',
      data: data as string | GeoJSON.FeatureCollection,
      cluster: true,
      clusterRadius,
      clusterMaxZoom,
    });

    // Add pulse layer (outermost layer with animation) if enabled
    if (clusterGlow) {
      map.addLayer({
        id: clusterPulseLayerId,
        type: 'circle',
        source: sourceId,
        filter: ['has', 'point_count'],
        paint: {
          // Same color as main cluster
          'circle-color': [
            'step',
            ['get', 'point_count'],
            clusterColors[0], // Green for small clusters (< 50 points)
            50,
            clusterColors[1], // Orange for medium clusters (50-99 points)
            100,
            clusterColors[2], // Pink/Red for large clusters (100+ points)
          ],
          // 2x main radius for pulse effect
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            40, // 40px pulse for small clusters (2x main 20px)
            50,
            60, // 60px pulse for medium clusters (2x main 30px)
            100,
            80, // 80px pulse for large clusters (2x main 40px)
          ],
          'circle-opacity': 0.0, // Will be animated
        },
      });
    }

    // Add glow layer (rendered behind main cluster layer) if enabled
    if (clusterGlow) {
      map.addLayer({
        id: clusterGlowLayerId,
        type: 'circle',
        source: sourceId,
        filter: ['has', 'point_count'],
        paint: {
          // Same color as main cluster
          'circle-color': [
            'step',
            ['get', 'point_count'],
            clusterColors[0], // Green for small clusters (< 50 points)
            50,
            clusterColors[1], // Orange for medium clusters (50-99 points)
            100,
            clusterColors[2], // Pink/Red for large clusters (100+ points)
          ],
          // 1.5x main radius for glow effect
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            30, // 30px glow for small clusters
            50,
            45, // 45px glow for medium clusters
            100,
            60, // 60px glow for large clusters
          ],
          'circle-blur': 1, // Gaussian blur for glow
          'circle-opacity': 0.4, // Semi-transparent
        },
      });
    }

    // Add cluster layer (circles with size/color based on point count)
    map.addLayer({
      id: clusterLayerId,
      type: 'circle',
      source: sourceId,
      filter: ['has', 'point_count'],
      paint: {
        // Color interpolation based on point count
        'circle-color': [
          'step',
          ['get', 'point_count'],
          clusterColors[0], // Green for small clusters (< 50 points)
          50,
          clusterColors[1], // Orange for medium clusters (50-99 points)
          100,
          clusterColors[2], // Pink/Red for large clusters (100+ points)
        ],
        // Radius interpolation based on point count
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20, // 20px for small clusters (< 50 points)
          50,
          30, // 30px for medium clusters (50-99 points)
          100,
          40, // 40px for large clusters (100+ points)
        ],
      },
    });

    // Add cluster count label layer
    // CRITICAL: Symbol layers must be added LAST to render on top of all other layers
    // This ensures cluster numbers appear above animated DOM markers when animatedPoints=true
    map.addLayer({
      id: clusterCountLayerId,
      type: 'symbol',
      source: sourceId,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-size': 14, // Increased from 12 for better visibility
        'text-allow-overlap': true, // Force labels to render even if they overlap
        'text-ignore-placement': true, // Ignore placement constraints
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': 'rgba(0, 0, 0, 0.3)', // Add subtle halo for contrast
        'text-halo-width': 1,
      },
    });

    // Add unclustered points layer (only if not using animated DOM markers)
    if (!animatedPoints) {
      map.addLayer({
        id: pointLayerId,
        type: 'circle',
        source: sourceId,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': pointColor,
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });
    }

    // Click handler for clusters
    const handleClusterClick = (e: MapLibreGL.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [clusterLayerId],
      });

      if (features.length > 0 && onClusterClick) {
        const feature = features[0];
        if (!feature) return;

        const clusterId = feature.properties?.cluster_id as number;
        const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        const pointCount = feature.properties?.point_count as number;

        // Get all leaves (individual points) in the cluster
        const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
        source
          .getClusterLeaves(clusterId, pointCount, 0)
          .then((leaves: GeoJSON.Feature[]) => {
            if (leaves) {
              const properties = leaves.map((f) => f.properties as T);
              onClusterClick(clusterId, coordinates, pointCount, properties);
            }
          })
          .catch((err: Error) => {
            console.error('Error getting cluster leaves:', err);
          });
      }
    };

    // Click handler for individual points (only if not using animated points)
    const handlePointClick = !animatedPoints
      ? (e: MapLibreGL.MapMouseEvent) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: [pointLayerId],
          });

          if (features.length > 0 && onPointClick) {
            const rawFeature = features[0];
            if (!rawFeature) return;

            // Convert MapGeoJSONFeature to GeoJSON.Feature with proper typing
            const feature: GeoJSON.Feature<GeoJSON.Point, T> = {
              type: 'Feature',
              geometry: rawFeature.geometry as GeoJSON.Point,
              properties: rawFeature.properties as T,
            };
            const coordinates = feature.geometry.coordinates.slice() as [number, number];
            onPointClick(feature, coordinates);
          }
        }
      : () => {}; // No-op if using animated points (they have own click handlers)

    // Register click handlers
    map.on('click', clusterLayerId, handleClusterClick);
    if (!animatedPoints) {
      map.on('click', pointLayerId, handlePointClick);
    }

    // Change cursor on hover
    const handleClusterMouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const handleClusterMouseLeave = () => {
      map.getCanvas().style.cursor = '';
    };
    const handlePointMouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const handlePointMouseLeave = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('mouseenter', clusterLayerId, handleClusterMouseEnter);
    map.on('mouseleave', clusterLayerId, handleClusterMouseLeave);
    if (!animatedPoints) {
      map.on('mouseenter', pointLayerId, handlePointMouseEnter);
      map.on('mouseleave', pointLayerId, handlePointMouseLeave);
    }

    // Animate pulse layer (if enabled)
    let animationFrameId: number | null = null;
    if (clusterGlow) {
      const animatePulse = () => {
        // Phase 2 Task 2.2: Pause animation during transitions
        if (isTransitioning) {
          animationFrameId = requestAnimationFrame(animatePulse);
          return;
        }

        const timestamp = performance.now();
        // 2.5s cycle (matching CSS animation duration)
        const progress = (timestamp % 2500) / 2500;

        // Opacity: 0.3 → 0 → 0.3 (pulse effect)
        const opacity =
          progress < 0.5
            ? 0.3 * (1 - progress * 2) // Fade out (0.3 → 0)
            : 0.3 * ((progress - 0.5) * 2); // Fade in (0 → 0.3)

        // Scale: 1 → 2 → 1 (radius expansion)
        const scale = 1 + progress;

        try {
          if (map.getLayer?.(clusterPulseLayerId)) {
            map.setPaintProperty(clusterPulseLayerId, 'circle-opacity', opacity);
            map.setPaintProperty(clusterPulseLayerId, 'circle-radius', [
              'step',
              ['get', 'point_count'],
              20 * scale, // Small clusters
              50,
              30 * scale, // Medium clusters
              100,
              40 * scale, // Large clusters
            ]);
          }
        } catch (_error) {
          // Ignore errors during animation (layer might be removed)
        }

        animationFrameId = requestAnimationFrame(animatePulse);
      };

      animationFrameId = requestAnimationFrame(animatePulse);
    }

    // Cleanup on unmount
    return () => {
      if (!map) return;

      // Stop animation
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      try {
        // Remove event listeners (safe even if handlers don't exist)
        map.off('click', clusterLayerId, handleClusterClick);
        if (!animatedPoints) {
          map.off('click', pointLayerId, handlePointClick);
          map.off('mouseenter', pointLayerId, handlePointMouseEnter);
          map.off('mouseleave', pointLayerId, handlePointMouseLeave);
        }
        map.off('mouseenter', clusterLayerId, handleClusterMouseEnter);
        map.off('mouseleave', clusterLayerId, handleClusterMouseLeave);

        // Remove layers only if they exist
        if (map.getLayer?.(clusterLayerId)) {
          map.removeLayer(clusterLayerId);
        }
        if (map.getLayer?.(clusterGlowLayerId)) {
          map.removeLayer(clusterGlowLayerId);
        }
        if (map.getLayer?.(clusterPulseLayerId)) {
          map.removeLayer(clusterPulseLayerId);
        }
        if (map.getLayer?.(clusterCountLayerId)) {
          map.removeLayer(clusterCountLayerId);
        }
        if (!animatedPoints && map.getLayer && map.getLayer(pointLayerId)) {
          map.removeLayer(pointLayerId);
        }

        // Remove source only if it exists
        if (map.getSource?.(sourceId)) {
          map.removeSource(sourceId);
        }
      } catch (_error) {
        // Silently handle cleanup errors (map may have been destroyed)
        console.warn('MapClusterLayer cleanup error (non-critical):', _error);
      }
    };
  }, [
    map,
    isLoaded,
    data,
    clusterRadius,
    clusterMaxZoom,
    clusterColors,
    pointColor,
    animatedPoints,
    clusterGlow,
    // NOTE: isTransitioning intentionally NOT in deps to prevent layer recreation
    // Animation pause is handled inside animatePulse() closure
    onClusterClick,
    onPointClick,
    sourceId,
    clusterLayerId,
    clusterGlowLayerId,
    clusterPulseLayerId,
    clusterCountLayerId,
    pointLayerId,
  ]);

  // Phase 2 Task 2.3: Dim glow effect during transitions
  useEffect(() => {
    if (!map || !isLoaded || !clusterGlow) return;

    try {
      if (map.getLayer?.(clusterGlowLayerId)) {
        // Dim glow during transitions to reduce visual noise
        const opacity = isTransitioning ? 0.2 : 0.4;
        map.setPaintProperty(clusterGlowLayerId, 'circle-opacity', opacity);
      }
    } catch (_error) {
      // Ignore errors if layer doesn't exist
    }
  }, [map, isLoaded, clusterGlow, isTransitioning, clusterGlowLayerId]);

  // Track unclustered points for animated DOM markers
  useEffect(() => {
    if (!map || !isLoaded || !animatedPoints) return;

    const updatePoints = () => {
      // Phase 2 Task 2.1: Signal transition start
      setIsTransitioning(true);

      // Clear existing transition timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      // Cancel pending update
      if (updatePointsRef.current !== null) {
        cancelAnimationFrame(updatePointsRef.current);
      }

      // Phase 1 Task 2.2: Schedule update for next frame (sync with MapLibre render)
      updatePointsRef.current = requestAnimationFrame(() => {
        const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
        if (!source) return;

        // Phase 1 Task 2.1: Query source features for animatedPoints mode
        // In animatedPoints mode, we don't render GL point layer, so queryRenderedFeatures returns empty
        // Instead, query source and filter out clusters to get unclustered points
        const features = map.querySourceFeatures(sourceId, {
          sourceLayer: undefined,
          filter: ['!', ['has', 'point_count']], // Exclude clusters - only get unclustered points
        });

        // Phase 1 Task 2.4: Add viewport bounds checking
        const bounds = map.getBounds();
        const visibleFeatures = features.filter((f) => {
          const coords = (f.geometry as GeoJSON.Point).coordinates;
          return bounds.contains([coords[0]!, coords[1]!]);
        });

        // Convert MapGeoJSONFeature to GeoJSON.Feature
        const convertedFeatures: GeoJSON.Feature<GeoJSON.Point, T>[] = visibleFeatures.map((f) => ({
          type: 'Feature',
          geometry: f.geometry as GeoJSON.Point,
          properties: f.properties as T,
        }));

        setUnclusteredPoints(convertedFeatures);
        updatePointsRef.current = null;

        // Phase 2 Task 2.1: Signal transition end after React renders
        transitionTimeoutRef.current = window.setTimeout(() => {
          setIsTransitioning(false);
        }, 300); // Match typical animation duration
      });
    };

    // Task 2.3: Listen to both moveend and data events
    // 'data' event fires when clustering recalculation completes
    const handleDataEvent = (e: MapLibreGL.MapDataEvent) => {
      // Only update when source data changes (clustering recalc)
      // @ts-expect-error - MapLibre types incomplete for data event properties
      if (e.sourceId === sourceId && e.isSourceLoaded) {
        updatePoints();
      }
    };

    map.on('moveend', updatePoints);
    map.on('data', handleDataEvent);
    updatePoints();

    return () => {
      map.off('moveend', updatePoints);
      map.off('data', handleDataEvent);
      if (updatePointsRef.current !== null) {
        cancelAnimationFrame(updatePointsRef.current);
      }
      // Phase 2 Task 2.1: Clear transition timeout
      if (transitionTimeoutRef.current !== null) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [map, isLoaded, animatedPoints, sourceId]);

  // Memoize marker components to prevent unnecessary re-renders
  const markerComponents = useMemo(() => {
    if (!animatedPoints || unclusteredPoints.length === 0) return null;

    return unclusteredPoints.map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const status = getPointStatus?.(feature.properties as T) ?? 'active';
      const markerStatus = mapBackendStatus(status);
      const featureId = (feature.properties as { id?: string })?.id ?? `${lng}-${lat}`;

      return (
        <MapMarker
          key={featureId}
          longitude={lng!}
          latitude={lat!}
          onClick={(e) => {
            e.stopPropagation();
            onPointClick?.(feature, [lng!, lat!]);
          }}
        >
          <div
            style={{
              // Phase 2 Task 2.4: Fade markers during transitions
              opacity: isTransitioning ? 0.7 : 1,
              transition: 'opacity 200ms ease-in-out',
              // Ensure markers don't block cluster clicks during transition
              pointerEvents: isTransitioning ? 'none' : 'auto',
            }}
          >
            <MarkerContent>
              <AnimatedPOSMarker status={markerStatus} size="sm" />
            </MarkerContent>
          </div>
        </MapMarker>
      );
    });
  }, [animatedPoints, unclusteredPoints, getPointStatus, onPointClick, isTransitioning]);

  // Render DOM markers for unclustered points when animatedPoints is enabled
  if (markerComponents) {
    return <>{markerComponents}</>;
  }

  // Component renders via MapLibre layers (no DOM output)
  return null;
}
