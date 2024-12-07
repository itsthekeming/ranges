import { Outlet, useParams } from "react-router";
import { dom } from "~/components/dom";
import { InformationPanel } from "~/components/information-panel";
import invariant from "tiny-invariant";

export default function Component() {
  const params = useParams();
  invariant(params.slug);

  const title = params.slug.replace(/_/g, " ");

  return (
    <>
      <Outlet />
      <dom.In>
        <InformationPanel title={title} />
      </dom.In>
    </>
  );
}
