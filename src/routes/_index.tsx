import type { Route } from "./+types/_index";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Distribution" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return <></>;
}
