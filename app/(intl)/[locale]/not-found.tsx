import { NotFoundContent } from "@/components/not-found-content";

/** 404 for "/<unknown>" segments that reach the locale route. */
const LocaleNotFound = (): React.JSX.Element => <NotFoundContent />;

export default LocaleNotFound;
