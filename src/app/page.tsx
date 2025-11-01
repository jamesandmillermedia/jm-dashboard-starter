import AuthForm from '@/src/components/AuthForm';

export default function Home() {
  return (
    <section className="py-16 space-y-6">
      <h1 className="text-3xl font-bold">James & Miller — Sign in</h1>
      <p className="muted">Use your email to receive a magic link.</p>
      <AuthForm />
    </section>
  );
}
