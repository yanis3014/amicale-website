import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RGPD - Amicale FPHM',
  description: "Politique de protection des données personnelles de l'Amicale FPHM.",
};

export default function RgpdPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="pt-16 bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[12px] tracking-[0.1em] text-[var(--accent)]">— AMICALE FPHM</p>
          <h1 className="mt-3 [font-family:'Newsreader',serif] text-[clamp(36px,8vw,80px)] leading-[0.98] font-normal text-[var(--ink)]">
            Politique <span className="italic text-[var(--accent)]">RGPD</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-2)]">
            Notre engagement pour une collecte et un traitement responsables des données personnelles.
          </p>
          <div className="mt-8 border-b border-[var(--line)]" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="max-w-3xl space-y-8 text-[15px] leading-relaxed text-[var(--ink-2)]">
          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Données collectées</h2>
            <p className="mt-3">
              Selon les services utilisés, nous pouvons collecter des données d&apos;identification et de contact
              (nom, prénom, e-mail), des informations liées à l&apos;adhésion, ainsi que des données techniques
              nécessaires au fonctionnement du site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Finalités du traitement</h2>
            <p className="mt-3">Les données sont traitées pour :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>gérer les demandes de contact et les échanges avec l&apos;association ;</li>
              <li>administrer les inscriptions, adhésions et services réservés aux membres ;</li>
              <li>améliorer le fonctionnement et la sécurité du site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Base légale</h2>
            <p className="mt-3">
              Les traitements reposent, selon les cas, sur l&apos;exécution d&apos;une relation associative, le
              respect d&apos;obligations légales, l&apos;intérêt légitime de l&apos;association ou le consentement
              lorsque celui-ci est requis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Durée de conservation</h2>
            <p className="mt-3">
              Les données sont conservées pour une durée proportionnée aux finalités poursuivies et aux obligations
              légales applicables, puis supprimées ou anonymisées.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Droits des utilisateurs</h2>
            <p className="mt-3">Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>accès à vos données personnelles ;</li>
              <li>rectification des données inexactes ;</li>
              <li>suppression des données lorsque cela est possible ;</li>
              <li>opposition ou limitation de certains traitements ;</li>
              <li>portabilité des données lorsque le cadre légal le prévoit.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Contact RGPD</h2>
            <p className="mt-3">
              Pour exercer vos droits ou poser une question relative à la protection des données, contactez-nous à{' '}
              <a className="text-[var(--accent)] underline underline-offset-4" href="mailto:asso.fphm@gmail.com">
                asso.fphm@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Sécurité</h2>
            <p className="mt-3">
              L&apos;association met en oeuvre des mesures techniques et organisationnelles raisonnables afin de
              protéger les données personnelles contre l&apos;accès non autorisé, l&apos;altération, la divulgation ou
              la perte.
            </p>
          </section>

          <p className="text-sm text-[var(--ink-2)]/80 border-t border-[var(--line)] pt-5">
            Cette politique est une base générique de conformité et peut être ajustée avec un conseil juridique en
            fonction des traitements réellement mis en oeuvre.
          </p>
        </div>
      </div>
    </div>
  );
}
