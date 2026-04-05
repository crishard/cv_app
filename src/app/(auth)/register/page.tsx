import { RegisterForm } from "@/components/auth/RegisterForm";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-900 p-12">
        <div className="flex items-center gap-2 text-white">
          <FileText className="h-6 w-6" />
          <span className="text-lg font-semibold tracking-tight">CVForge</span>
        </div>
        <div>
          <h2 className="text-2xl font-medium leading-snug text-white">
            Stand out from the crowd.
            <br />
            Get hired faster.
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              AI-powered bullet point generation
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              ATS score analysis & suggestions
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              Export to PDF in one click
            </li>
          </ul>
        </div>
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} CVForge
        </p>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <FileText className="h-5 w-5 text-zinc-900" />
            <span className="text-base font-semibold tracking-tight text-zinc-900">
              CVForge
            </span>
          </div>

          <h1 className="text-2xl font-bold text-zinc-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Start building your resume for free.
          </p>

          <div className="mt-8">
            <RegisterForm />
          </div>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
