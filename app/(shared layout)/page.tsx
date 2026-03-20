import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="py-12">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Welcome to My Blog
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Read amazing articles on tech, coding, and more.
        </p>
        <Link href="/blogs" className={buttonVariants({ size: "lg" })}>
          Explore
        </Link>
      </div>
    </section>
  );
}
