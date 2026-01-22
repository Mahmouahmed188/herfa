import { CreateJobForm } from '@/features/client/CreateJobForm';

export default function CreateJobPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Create Job</h1>
            </div>
            <CreateJobForm />
        </div>
    );
}
