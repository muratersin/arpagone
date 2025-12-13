"use client";

const RawHtmlRenderer = ({ html }: { html: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default function Email({ html }: { html: string }) {
  return <RawHtmlRenderer html={html || ""} />;
}
