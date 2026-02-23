import { LegalLayout } from '@/components/layout/LegalLayout';

export default function TermsOfService() {
    return (
        <LegalLayout title="Terms of Service" lastUpdated={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}>
            <section>
                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing or using the LUNATHELOVEGOD platform, website, and associated services (&quot;Platform,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;), or by clicking &quot;I Agree&quot; where such option is presented, you agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
                <p>
                    If you do not agree to these terms, do not use the Platform. By using the Platform, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.
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
                    We reserve the right to modify, suspend, or discontinue features at any time. For paying subscribers, in the event of a significant, long-term disruption to paid service tiers, we may provide pro-rated credits or refunds at our sole discretion.
                </p>
            </section>

            <section className="bg-cyan-950/20 border border-cyan-500/30 p-6 rounded-lg my-8">
                <h2 className="!mt-0 text-cyan-400">3. AI Disclaimer (Critical Notice)</h2>
                <p>
                    The Platform provides AI-generated content through modules like the <strong>Comms Interface (Signal Decoder)</strong>. You acknowledge that:
                </p>
                <ul>
                    <li>AI outputs may be inaccurate, incomplete, or hallucinated.</li>
                    <li>AI content does not constitute professional, legal, medical, or financial advice.</li>
                    <li>You are solely responsible for decisions made using AI outputs.</li>
                    <li>AI outputs may occasionally reflect the likeness, style, or voice of real individuals or artistic properties; such instances are generated programmatically and do not imply endorsement, sponsorship, or affiliation.</li>
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
                    Users retain ownership of content they upload but grant us a non-exclusive, worldwide, royalty-free license to display, distribute, host, and reproduce User content strictly in connection with platform operations and platform-related promotion.
                </p>
                <p>
                    <strong>AI Training Usage:</strong> We may use anonymized usage data and public interactions to improve our platform algorithms. However, we do not use your private personal content to train third-party AI models without your explicit consent.
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
                    <li>Use AI outputs to train, develop, or improve any AI models, machine learning systems, or similar technologies.</li>
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
                    Our total liability to you for any claim shall not exceed the amount paid by you to us in the past 12 months. Nothing in these Terms shall limit or exclude liability for gross negligence, willful misconduct, or any other liability which cannot be limited or excluded by applicable law.
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
                    These Terms are governed by the laws of the State of New York. Any disputes arising out of or relating to these Terms or the Platform shall be resolved exclusively through binding arbitration administered by <strong>JAMS</strong> in accordance with its Comprehensive Arbitration Rules.
                </p>
                <p>
                    Arbitration will take place in New York, NY. Each party will be responsible for their own attorney fees, and the cost of arbitration will be shared equally unless the arbitrator determines the claim is frivolous. This clause prevents you from pursuing class action lawsuits.
                </p>
            </section>

            <section>
                <h2>11. DMCA / Copyright Takedown Policy</h2>
                <p>
                    If you believe that any content on the Platform infringes your copyright, please send a notice to our designated agent at: <a href="mailto:copyright@lunathelovegod.com">copyright@lunathelovegod.com</a>. Your notice must include:
                </p>
                <ul>
                    <li>A physical or electronic signature of the copyright owner or authorized agent.</li>
                    <li>A description of the copyrighted work you claim has been infringed.</li>
                    <li>The location of the infringing material on our Platform (URL or specific description).</li>
                    <li>Your name, address, telephone number, and email address.</li>
                    <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner, its agent, or the law.</li>
                    <li>A statement, under penalty of perjury, that the info in your notice is accurate and you are the copyright owner or authorized to act on their behalf.</li>
                </ul>
                <p>
                    <strong>Repeat Infringer Policy:</strong> We will terminate the accounts of users determined to be repeat infringers in appropriate circumstances.
                </p>
                <p>
                    <strong>Counter-Notification Procedure:</strong> If content you posted was removed due to a DMCA notice and you believe this was an error, you may send a counter-notice to our agent containing: (1) your signature; (2) identification of the removed material; (3) a statement under penalty of perjury that you have a good faith belief the material was removed by mistake; and (4) your contact info and consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located.
                </p>
            </section>

            <section>
                <h2>12. Force Majeure</h2>
                <p>
                    LUNATHELOVEGOD shall not be liable for any delay or failure to perform resulting from causes outside its reasonable control, including, but not limited to, acts of God, war, terrorism, riots, embargos, acts of civil or military authorities, fire, floods, accidents, strikes, shortages of transportation facilities, fuel, energy, labor, or materials, or **pandemics, epidemics, or public health emergencies**.
                </p>
            </section>

            <section>
                <h2>13. Severability</h2>
                <p>
                    If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect and enforceable.
                </p>
            </section>

            <section>
                <h2>14. Changes to Terms</h2>
                <p>
                    We reserve the right to update these Terms at any time. We will indicate the &quot;Last Updated&quot; date at the top of this page. For <strong>material changes</strong> (e.g., updates to pricing, dispute resolution/arbitration, or significant changes to data usage/AI training), we will attempt to provide notice via email to registered users. Continued use of the Platform after changes constitutes your acceptance of the new Terms.
                </p>
            </section>
        </LegalLayout>
    );
}
