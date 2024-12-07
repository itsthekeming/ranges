import type { LoaderFunctionArgs} from "react-router";
import { Outlet, useLoaderData } from "react-router";
import { dom } from "~/components/dom";
import { InformationPanel } from "~/components/information-panel";
import invariant from "tiny-invariant";
import wikipedia from 'wikipedia'

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  invariant(slug);

  const [page, content] = await Promise.all([
    wikipedia.page(slug),
    wikipedia.html(slug)
  ])

  const data = {
    title: page.title,
    content
  };

  return data;
}

export default function Component() {
  const { title, content } = useLoaderData<typeof loader>()
  
  return (
    <>
      <Outlet />
      <dom.In>
        <InformationPanel title={title} content={content} />
      </dom.In>
    </>
  );
}
