import clsx from "clsx";

export type ButtonProps = JSX.IntrinsicElements["button"];

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded bg-s2-indigo-600 px-4 py-1 text-white hover:bg-s2-indigo-700 active:bg-s2-indigo-500",
        className
      )}
    />
  );
}
