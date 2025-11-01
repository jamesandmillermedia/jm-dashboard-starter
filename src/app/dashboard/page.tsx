import Nav from '@/src/components/Nav';
import { supabaseServer } from '@/src/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = supabaseServer();

  const { data: clients } = await supabase
    .from('clients')
    .select('id, full_name, phone, email')
    .order('created_at', { ascending: false })
    .limit(50);

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, status, scheduled_for, client_id')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <section className="py-6 space-y-6">
      <Nav />
      <h2 className="text-2xl font-semibold">Overview</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2">Recent Clients</h3>
          <table>
            <thead><tr><th>Name</th><th>Phone</th><th>Email</th></tr></thead>
            <tbody>
              {(clients ?? []).map((c:any) => (
                <tr key={c.id}>
                  <td>{c.full_name}</td><td>{c.phone}</td><td>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Recent Jobs</h3>
          <table>
            <thead><tr><th>Title</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {(jobs ?? []).map((j:any) => (
                <tr key={j.id}>
                  <td>{j.title}</td><td>{j.status}</td><td>{j.scheduled_for ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
