import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-8">
      <Empty className="max-w-md w-full border border-dashed border-border">
        <EmptyHeader>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-center">
            <Link href="/app">
              <Button variant="default" className="w-full sm:w-auto">
                Go to dashboard
              </Button>
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
