import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-white mb-4">Application Submitted!</h1>
        <p className="text-[var(--gray-400)] mb-8">
          Check your email for your first task and next steps.
        </p>
        <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg p-6 mb-8">
          <h3 className="text-white font-semibold mb-2">What's Next?</h3>
          <ul className="text-[var(--gray-400)] space-y-2 text-left">
            <li>✅ You'll receive a welcome email within 2 minutes</li>
            <li>✅ Join our Discord/Slack community</li>
            <li>✅ Complete your first task</li>
            <li>✅ Get access to premium AI tools</li>
          </ul>
        </div>
        <a href="/" className="btn-primary px-8 py-3 inline-block">
          Back to Home
        </a>
      </div>
      <Footer />
    </div>
  );
}
