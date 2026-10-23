# Evidence and implementation provenance

Verified 2026-10-23. This is an independent implementation of published research methods, not a translation or copy of the member-only MDS website. No official calculator code, logo, screenshot, proprietary questionnaire or item-level MDS-UPDRS content is included. Agreement with the current official calculator has not been established. The version is deliberately fixed to the 2019 publication, not described as the latest criteria.

## Primary sources

1. Heinzel S, Berg D, Gasser T, Chen H, Yao C, Postuma RB, and the MDS Task Force on the Definition of Parkinson's Disease. *Update of the MDS research criteria for prodromal Parkinson's disease*. Movement Disorders. 2019;34:1464–1470. DOI: [10.1002/mds.27802](https://doi.org/10.1002/mds.27802).
   - [Publisher full text](https://movementdisorders.onlinelibrary.wiley.com/doi/full/10.1002/mds.27802)
   - [UCL open-access PDF](https://discovery.ucl.ac.uk/10123158/1/mds.27802.pdf)
   - Table 1, p1466: all risk and prodromal marker LRs.
   - Table 2, p1466: age bands, prior probabilities, GBA and LRRK2 p.G2019S LRs. Values are used as printed (including rounded genetic LRs); no interpolation.
   - Genetic Risk Markers, pp1465–1467: exclusion of high-penetrance mutations; family history vs genetic findings; PRS sample quartiles.
   - Newly Added Markers, p1467: activity <1 hour/week; male plasma urate <5 and >5.6 mg/dL. The published text describes 5–5.5 as borderline; the tool also leaves 5.5–5.6 and exactly 5.6 neutral because no applicable LR is specified.
   - p1464: Creative Commons Attribution open-access statement; copyright correction dated 2020-12-11.
   - pp1467–1468: research-only status, marker dependence, uncertainty and population differences.
2. Berg D, Postuma RB, Adler CH, et al. *MDS research criteria for prodromal Parkinson's disease*. Movement Disorders. 2015;30:1600–1611. DOI: [10.1002/mds.26431](https://doi.org/10.1002/mds.26431).
   - [Stanford-hosted author article PDF](https://med.stanford.edu/content/dam/sm/epidemiology/documents/HRP236/MDS-research-criteria-for-prodromal-Parkinsons-disease.pdf)
   - pp1601–1602: present prodromal state rather than time-to-conversion; probability ≥80% and prodromal evidence combined LR ≥4; age prior and Bayes methodology.
   - pp1603–1605: exposure definitions, objective olfactory testing, RBD specificity, confounders and symptom definitions.
   - p1606, Clinical Motor Markers: both motor tests positive → higher LR+; both negative → lower LR−; discordant → multiply both. Applied with updated 2019 values.
   - Unknown/borderline values omitted. This project does not reuse the old approximate total-LR thresholds. At prior 2%, the exact LR for 80% is 196, not the approximate 180 printed in the old threshold table.

## Implementation decisions

- Input is structured selections only; no identifiers, free text, upload, cloud storage or export.
- Age is a band, not a date of birth. Under 50 and unconfirmed eligibility block output.
- The high-penetrance question means an established applicable pathogenic genotype, not every heterozygous recessive variant or variant of uncertain significance. GBA/LRRK2 are separate intermediate-penetrance paths.
- RBD and OH each use a single selected assessment level. Use a definitive PSG result when available; uncertainty is omitted rather than treated as a negative.
- Family history, GBA, LRRK2 and PRS are a single mutually exclusive control, consistent with the “or” alternatives in Table 1. Dual mutations and combinations are not modeled.
- All included prodromal LRs, including assessed negatives, contribute to the prodromal combined LR. Substantia nigra ultrasound is a risk marker.
- Male-only markers are disabled and cleared when sex is female or unspecified; the calculation layer also excludes them defensively.
- Isolated anxiety without depression is neutral (LR 1), not a depression-positive marker or an absence-of-depression LR−; this follows the 2015 p1605 restriction on LR− when anxiety symptoms exist.
- NA is a neutral LR of 1, not LR 0. Negative assessed outcomes with supported LR− are included.
- No self-reported symptom is silently treated as a validated objective test. The professional user must apply source definitions and exclude alternative explanations.
- Research classification uses full-precision posterior odds ≥4 and prodromal combined LR ≥4. Display values are rounded separately.

## Search record

Targeted source verification, not a systematic review. Date: 2026-10-23 (Asia/Taipei).

Web queries: `site.movementdisorders.org prodromal calculator copyright permission 2019`; `Update MDS research criteria prodromal Parkinson 2019 likelihood ratios table`. Read primary 2019 full text, its Table 1/2, 2015 primary PDF and official website terms. Search engine returned multiple results without a stable total-hit count. No claim of exhaustive evidence coverage is made. Current official member-only calculator was not accessed beyond its public login landing page.

## Attribution and changes

2019 article © 2019 The Authors, published by Wiley on behalf of MDS, under a Creative Commons Attribution license. See the publisher for the applicable license. This project adapts published parameter data and descriptions into Traditional Chinese, writes new source code and interface, and adds explicit eligibility, dependency and privacy behavior. No endorsement by the authors, publisher or MDS is implied. The 2015 paper is cited for methodology, not redistributed in this repository.
