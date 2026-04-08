import type { LoginFlow, Session, UpdateLoginFlowBody } from '@ory/client';

export interface LoginParams {
  flowId: string;
  body: UpdateLoginFlowBody;
}

export interface LoginResponse {
  session: Session;
  redirectTo?: string;
}

export interface CreateLoginFlowParams {
  refresh?: boolean;
  aal?: 'aal1' | 'aal2';
  returnTo?: string;
}

export interface GetLoginFlowParams {
  id: string;
}

export type { LoginFlow, Session, UpdateLoginFlowBody };
