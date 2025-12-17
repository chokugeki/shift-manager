'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DebugRLS() {
    const [user, setUser] = useState<any>(null);
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const check = async () => {
            setLoading(true);
            try {
                // 1. Check Auth User
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                // 2. Fetch Data (Staff)
                // We purposefully select user_id to see if it exists (if RLS allows, or if we are owner)
                const { data, error } = await supabase.from('staff').select('id, name, user_id');

                if (error) throw error;
                setStaff(data || []);

            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        check();
    }, []);

    return (
        <div className="p-8 font-mono">
            <h1 className="text-2xl font-bold mb-4">RLS Debugger</h1>

            <div className="mb-8 border p-4 rounded bg-gray-50">
                <h2 className="font-bold">Current User</h2>
                <pre>{JSON.stringify(user, null, 2)}</pre>
                {!user && <p className="text-red-600 font-bold">NOT LOGGED IN (RLS matches Anon)</p>}
            </div>

            <div className="mb-8 border p-4 rounded bg-gray-50">
                <h2 className="font-bold">Visible Staff Data ({staff.length})</h2>
                {error && <p className="text-red-600">Error: {error}</p>}
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>User ID (Owner)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(s => (
                            <tr key={s.id} className="border-t">
                                <td className="py-1">{s.name}</td>
                                <td className="py-1">{s.user_id || 'NULL'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {staff.length > 0 && (
                    <p className="mt-2 text-yellow-600">
                        Warning: If you see data here that doesn't belong to this user, RLS is failing.
                    </p>
                )}
            </div>

            <div className="text-sm text-gray-500">
                <p>Troubleshooting Guide:</p>
                <ul className="list-disc pl-5">
                    <li>If User is NULL: Login first.</li>
                    <li>If Data shows records with user_id = NULL: These are old records. They should be hidden if RLS is ENABLED and Policy is correct.</li>
                    <li>If Data shows records with DIFFERENT user_id: RLS is definitely broken or Policy is "TRUE".</li>
                </ul>
            </div>
        </div>
    );
}
