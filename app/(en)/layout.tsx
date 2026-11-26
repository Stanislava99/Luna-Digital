import { baseMetadata, baseViewport, RootDocument } from "@/components/pages/RootDocument";

export const metadata = baseMetadata;
export const viewport = baseViewport;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
