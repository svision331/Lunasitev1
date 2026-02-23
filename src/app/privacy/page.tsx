import { LegalLayout } from '@/components/layout/LegalLayout';

export default function PrivacyPolicy() {
    return (
        <LegalLayout title="Privacy Policy" lastUpdated={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}>
            <section>
                <h2>1. Information We Collect</h2>
                <p>We may collect the following types of information when you interact with the LUNATHELOVEGOD platform:</p>

                <h3 className="text-cyan-300">A. Personal Information</h3>
                <ul>
                    <li>Name</li>
                    <li>Email address (e.g., when joining the Ice Giants community or Space Invaders)</li>
                    <li>Billing details (processed securely via third parties)</li>
                    <li>Account credentials</li>
                </ul>

                <h3 className="text-cyan-300">B. Usage Data</h3>
                <ul>
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Interaction data (e.g., usage of the Nebula Console, active modules)</li>
                    <li>Analytics and diagnostic data</li>
                </ul>

                <h3 className="text-cyan-300">C. AI Interaction Data (Important)</h3>
                <ul>
                    <li>Prompt broadcasts sent to the Comms Interface / Signal Decoder</li>
                    <li>Generated signal fragments and outputs from the AI</li>
                    <li>Usage patterns specifically related to conversational features</li>
                </ul>

                <h4 className="text-cyan-400 mt-6 mb-2 uppercase tracking-widest text-sm">AI Specific Disclosures</h4>
                <div className="bg-cyan-950/20 border border-cyan-500/30 p-4 rounded-lg space-y-4 text-sm">
                    <p>
                        <strong>AI Accuracy Disclaimer:</strong> While we strive for cosmic precision, AI outputs are generated through probabilistic models and may be inaccurate, incomplete, or hallucinated. We do not guarantee the correctness of any AI-generated transmission.
                    </p>
                    <p>
                        <strong>No Professional Advice:</strong> AI outputs are for entertainment and creative purposes only. They do not constitute professional, legal, medical, or financial advice.
                    </p>
                    <p>
                        <strong>User Responsibility:</strong> You are solely responsible for your use of AI outputs. Any decisions or actions taken based on AI fragments are at your own risk.
                    </p>
                    <p>
                        <strong>Model Limitations:</strong> Our AI systems have finite knowledge cutoffs and technical limitations. They may exhibit biases inherent in the training data and are not a substitute for human judgement.
                    </p>
                </div>
            </section>

            <section>
                <h2>2. How We Use Your Data</h2>
                <p>We use the collected information to:</p>
                <ul>
                    <li>Provide and maintain our services and the Space Invaders community.</li>
                    <li>Improve and train our AI systems for better user experiences.</li>
                    <li>Process payments securely.</li>
                    <li>Communicate with users regarding updates, drops, or shows.</li>
                    <li>Prevent fraud and ensure platform security.</li>
                </ul>
                <p className="font-bold text-cyan-200">We do NOT sell your personal data to third parties.</p>
            </section>

            <section>
                <h2>3. Payment Processing</h2>
                <p>
                    Payments are processed by trusted third-party providers (e.g., Stripe). We do not store full credit card numbers or raw payment data on our servers.
                </p>
            </section>

            <section>
                <h2>4. Cookies</h2>
                <p>We use cookies and similar tracking technologies to:</p>
                <ul>
                    <li>Improve user experience and website performance.</li>
                    <li>Track analytics to understand how our audience interacts with the site.</li>
                    <li>Enable login sessions and remember preferences.</li>
                </ul>
                <p>
                    Users may disable cookies in their browser settings, though some platform features may become unavailable or function improperly.
                </p>
            </section>

            <section>
                <h2>5. Data Retention</h2>
                <p>We retain data as long as necessary to:</p>
                <ul>
                    <li>Provide our services and features.</li>
                    <li>Comply with strictly enforced legal obligations.</li>
                    <li>Resolve disputes or enforce our agreements.</li>
                </ul>
                <p>
                    Users may request data deletion by contacting: <a href="mailto:privacy@lunathelovegod.com">privacy@lunathelovegod.com</a>
                </p>
            </section>

            <section>
                <h2>6. Security</h2>
                <p>
                    We implement reasonable administrative, technical, and physical safeguards designed to protect personal data. However, transmitting data over the internet is inherently risky, and no system is 100% secure.
                </p>
            </section>

            <section>
                <h2 className="text-cyan-400">7. Your Rights (Important)</h2>
                <p>Depending on your location (such as if you are a California resident under CPRA), you may have rights to:</p>
                <ul>
                    <li>Access the personal data we hold about you.</li>
                    <li>Correct inaccuracies in your data.</li>
                    <li>Request deletion of your data.</li>
                    <li>Opt out of certain data processing activities.</li>
                </ul>
            </section>

            <section>
                <h2>8. Children&apos;s Privacy</h2>
                <p>
                    LUNATHELOVEGOD is not intended for users under the age of 18. We do not knowingly collect personal data from minors. If we learn we have collected data from a minor, it will be deleted immediately.
                </p>
            </section>

            <section>
                <h2>9. Changes to this Policy</h2>
                <p>
                    We may update this Privacy Policy periodically to reflect changes in our practices or legal obligations. Continued use of the platform implies acceptance of these changes.
                </p>
            </section>
        </LegalLayout>
    );
}
