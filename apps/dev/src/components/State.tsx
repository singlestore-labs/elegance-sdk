import { ConnectionTypes } from "@singlestore/elegance-sdk/types";

export type StateProps = JSX.IntrinsicElements["div"] & {
  connectionType?: ConnectionTypes;
  mysqlState?: object;
  kaiState?: object;
  title?: string;
};

export function State({ connectionType, mysqlState, kaiState, title = "Feature state", ...props }: StateProps) {
  const state = connectionType ? (connectionType === "kai" ? kaiState : mysqlState) : mysqlState || kaiState;

  return (
    <div {...props} className="mt-8">
      <h2 className="text-xl">{title}</h2>
      <pre className="mt-8 max-h-[512px] w-full overflow-x-auto overflow-y-auto whitespace-pre-wrap rounded border p-4">
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}
