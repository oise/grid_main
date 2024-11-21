import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.pathname === "/") {
    return redirect("/grids");
  }
  return redirect(url.pathname);
};

export default function _index() {
  return null;
}
