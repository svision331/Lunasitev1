import { LegalLayout } from '@/components/layout/LegalLayout';

export default function TermsOfService() {
    return (
        <LegalLayout title="Terms of Service" lastUpdated={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}>
            <section>
                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing or using the LUNATHELOVEGOD platform, website, and associated services (&quot;Platform,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;), you agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
                <p>
                    If you do not agree to these terms, do not use the Platform. You must be at least 18 years old to use the Platform.
                </p>
            </section>

            <section>
                <h2>2. Description of Services</h2>
                <p>
                    LUNATHELOVEGOD is a creative platform that may provide:
                </p>
                <ul>
                    <li>Audio and visual experiences (e.g., Music Player, HoloCards).</li>
                    <li>Community features (Space Invaders network, Ice Giants Memberships).</li>
                    <li>Interactive platform tools (Nebula Console, Cosmos Map).</li>
                    <li>AI-powered communication modules (Comms Interface / Signal Decoder).</li>
                    <li>Merchandise, event tickets, or digital goods.</li>
                </ul>
                <p>
                    We may modify, suspend, or discontinue features at any time without liability.
                </p>
            </section>

            <section className="bg-cyan-950/20 border border-cyan-500/30 p-6 rounded-lg my-8">
                <h2 className="!mt-0 text-cyan-400">3. AI Disclaimer (Critical Notice)</h2>
                <p>
                    The Platform provides AI-generated content through modules like the <strong>Comms Interface (Signal Decoder)</strong>. You acknowledge that:
                </p>
                <ul>
                    <li>AI outputs may be inaccurate, incomplete, or biased.</li>
                    <li>AI content does not constitute professional, legal, or medical advice.</li>
                    <li>You are solely responsible for decisions made using AI outputs.</li>
                    <li>We do not guarantee results or outcomes from AI use.</li>
                </ul>
                <p className="font-bold text-cyan-200">
                    LUNATHELOVEGOD and its affiliates disclaim all liability arising from reliance on AI-generated content.
                </p>
            </section>

            <section>
                <h2>4. User Accounts</h2>
                <p>
                    You are responsible for:
                </p>
                <ul>
                    <li>Maintaining account confidentiality.</li>
                    <li>All activity occurring under your account.</li>
                    <li>Providing accurate and current information.</li>
                </ul>
                <p>
                    We reserve the right to suspend or terminate accounts at our sole discretion for any reason, including violation of these Terms.
                </p>
            </section>

            <section>
                <h2>5. Intellectual Property</h2>
                <p>
                    All content on the Platform, including logos, branding, design systems, software, code, audio tracks, and creative assets, are owned by LUNATHELOVEGOD unless otherwise stated.
                </p>
                <p>
                    Users retain ownership of content they upload but grant us a non-exclusive, worldwide, royalty-free license to display, distribute, promote, host, and reproduce User content in connection with platform operations.
                </p>
            </section>

            <section>
                <h2>6. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul>
                    <li>Violate any local, state, or federal laws.</li>
                    <li>Infringe upon intellectual property rights.</li>
                    <li>Upload illegal, harmful, or abusive content.</li>
                    <li>Reverse engineer the platform or AI systems.</li>
                    <li>Exploit platform vulnerabilities or use bots/scripts to scrape data.</li>
                    <li>Use AI outputs to train competing models.</li>
                </ul>
                <p>
                    Violation of these rules will result in immediate termination of access.
                </p>
            </section>

            <section>
                <h2>7. Payments & Subscriptions</h2>
                <p>
                    If purchasing merchandise, tickets, or premium features:
                </p>
                <ul>
                    <li>Subscription fees are billed in advance.</li>
                    <li>All payments are processed securely via third-party providers (e.g., Stripe).</li>
                    <li>Prices may change with reasonable prior notice.</li>
                    <li>Failure to pay may result in service suspension.</li>
                </ul>
                <p>
                    Please refer to our <a href="/refund">Refund Policy</a> for detailed information on returns and chargebacks.
                </p>
            </section>

            <section>
                <h2>8. Limitation of Liability</h2>
                <p>
                    To the maximum extent permitted by law, LUNATHELOVEGOD shall not be liable for any indirect damages, lost profits, data loss, business interruption, or consequential damages arising out of or in connection with your use of the Platform.
                </p>
                <p>
                    Our total liability to you for any claim shall not exceed the amount paid by you to us in the past 12 months.
                </p>
            </section>

            <section>
                <h2>9. Indemnification</h2>
                <p>
                    You agree to indemnify and hold harmless LUNATHELOVEGOD, its affiliates, officers, and partners from any claims arising from your use of the Platform, your user content, or your violation of these Terms.
                </p>
            </section>

            <section>
                <h2>10. Governing Law & Dispute Resolution</h2>
                <p>
                    These Terms are governed by the laws of the State of New York. Any disputes arising out of or relating to these Terms or the Platform shall be resolved exclusively through binding arbitration in New York, NY, preventing you from pursuing class action lawsuits.
                </p>
            </section>

            <section>
                <h2>11. Changes to Terms</h2>
                <p>
                    We reserve the right to update these Terms at any time. We will indicate the &quot;Last Updated&quot; date at the top of this page. Continued use of the Platform after changes constitutes your acceptance of the new Terms.
                </p>
            </section>
        </LegalLayout>
    );
}
