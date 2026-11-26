import { builderMetadata, BuilderShell } from "@/components/pages/BuilderPage";
import type { Locale } from "@/lib/i18n";

export const generateMetadata = async ({ params }: { params: Promise<{ lang: string }> }) => builderMetadata((await params).lang as Locale);

export default BuilderShell;
