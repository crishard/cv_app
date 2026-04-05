import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { FileText } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-900 p-12">
        <div className="flex items-center gap-2 text-white">
          <FileText className="h-6 w-6" />
          <span className="text-lg font-semibold tracking-tight">CVForge</span>
        </div>
        <div>
          <blockquote className="text-2xl font-medium leading-snug text-white">
            "Your resume is the first impression.<br />
            Make it count."
          </blockquote>
          <p className="mt-4 text-sm text-zinc-400">
            Build ATS-optimized resumes in minutes with AI assistance.
          </p>
        </div>
        <p className="text-xs text-zinc-500">© {new Date().getFullYear()} CVForge</p>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <FileText className="h-5 w-5 text-zinc-900" />
            <span className="text-base font-semibold tracking-tight text-zinc-900">CVForge</span>
          </div>

          <h1 className="text-2xl font-bold text-zinc-900">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in to continue building your resume.</p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-sm text-zinc-500">
            No account?{" "}
            <Link href="/register" className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
