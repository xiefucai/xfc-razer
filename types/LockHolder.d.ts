type LockMode = 'exclusive' | 'shared';
interface Lock {
  name: string;
  mode: LockMode;
}
interface LockManagerStateHeld extends Lock {
  clientId: string;
}
type Callback = (lock: Lock) => void;

type LockManagerState = {
  held: LockManagerStateHeld[];
  pending: LockManagerStateHeld[];
};

interface LockManagerRequestOptions {
  mode?: LockMode;
  ifAvailable?: boolean;
  steal?: boolean;
  signal?: AbortSignal;
}

declare function LockManagerRequest(name: string, callback: Callback): Lock;
declare function LockManagerRequest(
  name: string,
  options: LockManagerRequestOptions,
  callback: Callback,
): Lock;

interface LockManager {
  request: LockManagerRequest;
  query: () => Promise<LockManagerState>;
}

interface Navigator {
  locks: LockManager;
}

type Resolver = (value?: unknown) => void;
