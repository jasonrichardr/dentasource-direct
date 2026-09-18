// Module lists behind the eight tracks (round 4, 2026-09-17: "put the modules there when they click the eight tracks").
// Dental Assistant Training uses the FFC list word for word (ffcmodules.js DA). The rest are written for the Training Center.
import { DA } from './ffcmodules';

const M = (title, points) => ({ title, points });

export const TRACK_MODULES = {
  digital: {
    lead: 'Scan to design to manufacture, on the scanners, mills and printers in the showroom. One station per person.',
    modules: [
      M('Module 1 · The digital chair', ['What changes when the impression is a file', 'Scanner, design software, mill, printer: who does what', 'Choosing an open system so your files stay yours']),
      M('Module 2 · Intraoral scanning', ['Scan strategy for a full arch in one pass', 'Retraction, moisture and the margin', 'Bite registration and checking the occlusion on screen']),
      M('Module 3 · CAD design', ['Margin marking and insertion path', 'Designing a crown, an inlay and a three-unit bridge', 'Contacts and occlusion you can trust']),
      M('Module 4 · CAM and 3D printing', ['Nesting, supports and material choice', 'Milling versus printing: when each wins', 'Post-processing, sintering and glazing']),
      M('Module 5 · Guided workflows', ['CBCT plus scan: merging the two', 'Surgical guides and how much to trust them', 'Same-day delivery and what to check before seating']),
      M('Module 6 · Your first digital week', ['A written protocol for your clinic', 'Pricing a same-day crown', 'Photographing and posting the result properly']),
    ],
  },
  assistant: { lead: DA.lead, modules: DA.modules },
  ortho: {
    lead: 'Mini screws, TADs and wire bending with the Orthostrategy Study Group. Simulator first, then the chair under a mentor.',
    modules: [
      M('Module 1 · Why TADs', ['Anchorage in plain words', 'Cases that change once you can place a screw', 'Cases that should still be referred']),
      M('Module 2 · Selection and safe zones', ['Screw length, diameter and thread', 'The 30 degree safe-zone law', 'Reading the CBCT for root proximity']),
      M('Module 3 · Placement technique', ['Self-drilling, step by step', 'Angulation, torque and the feel of good bone', 'Soft tissue management around the head']),
      M('Module 4 · Biomechanics', ['Direct and indirect anchorage', 'Force levels, elastics and springs', 'Intrusion, retraction and distalization set-ups']),
      M('Module 5 · Wire bending', ['Pliers, wires and the arch form: which wire for which job', 'First-, second- and third-order bends on the typodont', 'Loops, springs and hooks that work with a TAD', 'Bending to the case: intrusion arches and retraction hooks']),
      M('Module 6 · Hands-on', ['Placement on the simulator, every angle', 'Loading and checking mobility', 'Removal and what a failed screw teaches']),
      M('Module 7 · Live patient day', ['Case presentation and consent', 'Placement under supervision', 'Follow-up schedule and troubleshooting']),
    ],
  },
  endo: {
    lead: 'Rotary systems, apex locators and obturation on Denjoy equipment, taught with FFC Dental Clinic, from access to the final radiograph.',
    modules: [
      M('Module 1 · Access and anatomy', ['Access shapes that find every canal', 'Reading the pre-op radiograph for surprises', 'Magnification and light']),
      M('Module 2 · Working length', ['Apex locators: how they read and when they lie', 'Confirming with the radiograph', 'Reference points that do not move']),
      M('Module 3 · Rotary shaping', ['Motor settings, torque and speed', 'File sequences on Denjoy systems', 'Avoiding separation and ledges']),
      M('Module 4 · Irrigation and disinfection', ['Sodium hypochlorite, EDTA and activation', 'Time, volume and safety', 'Intracanal medicaments']),
      M('Module 5 · Obturation', ['Warm vertical and single cone', 'Sealers and what they forgive', 'The post-op radiograph you want to see']),
      M('Module 6 · Hands-on', ['Extracted teeth and blocks', 'Full case on the simulator', 'Retreatment basics']),
    ],
  },
  prostho: {
    lead: 'Preparation, impression and digital design for crowns and bridges that fit the first time.',
    modules: [
      M('Module 1 · Treatment planning', ['Occlusion and vertical dimension basics', 'Choosing the material for the case', 'Sequencing a multi-unit case']),
      M('Module 2 · Preparation', ['Reduction guides and burs', 'Margin design for each material', 'Retraction and tissue management']),
      M('Module 3 · Impressions, analog and digital', ['Conventional technique that still works', 'Scanning a prepared tooth cleanly', 'Checking the margin on screen before sending']),
      M('Module 4 · Provisionals', ['Fast, strong temporaries', 'Testing the aesthetics before the final', 'Cementation that comes off']),
      M('Module 5 · Try-in and cementation', ['Checking fit, contacts and occlusion', 'Cement choice by material', 'Clean-up and the follow-up visit']),
      M('Module 6 · Hands-on', ['Crown prep on the simulator', 'Design and mill a crown', 'Seat it and adjust']),
    ],
  },
  surgery: {
    lead: 'Surgical fundamentals and implant planning with the Crest Study Group: know, practice, perform.',
    modules: [
      M('Module 1 · Surgical foundations', ['Anatomy that matters at the chair', 'Instruments and flap design', 'Local anaesthesia and haemostasis']),
      M('Module 2 · Extractions', ['Simple and surgical extractions', 'Sectioning and bone removal', 'Sutures and post-op care']),
      M('Module 3 · Medically compromised patients', ['Anticoagulants, diabetes, bisphosphonates', 'When to consult and when to refer', 'Emergency kit and protocol']),
      M('Module 4 · Implant planning', ['Reading the CBCT for bone and nerves', 'Prosthetically driven planning', 'Guided versus freehand']),
      M('Module 5 · Placement and restoration', ['Osteotomy sequence and torque', 'Healing, uncovering and impressions', 'The restored implant: screw and cement retained']),
      M('Module 6 · Supervised live sessions', ['Case selection with a mentor', 'Your surgery, supervised', 'Follow-up and complications']),
    ],
  },
  aesthetics: {
    lead: 'Shade, composite layering and smile design with the tools we demonstrate in the showroom.',
    modules: [
      M('Module 1 · Seeing the smile', ['Photography for the case', 'Proportions and the golden rules that actually help', 'Smile design on the screen']),
      M('Module 2 · Shade', ['Shade taking with the device, not the eye', 'Value, chroma and hue in composite', 'Communicating shade to the lab']),
      M('Module 3 · Composite layering', ['Anterior layering: dentine, enamel, effects', 'Finishing and polishing that lasts', 'Repairing and refreshing old work']),
      M('Module 4 · Veneers and bleaching', ['Case selection and preparation', 'Try-in, cementation and the first week', 'Whitening protocols that do not sensitise']),
      M('Module 5 · Hands-on', ['Class IV build-up on the simulator', 'Diastema closure', 'Before and after, shot properly']),
    ],
  },
  business: {
    lead: 'Running the clinic as a business, with DentaDesk, a free app for your own clinic on Mac, Windows, iOS and Android.',
    modules: [
      M('Module 1 · Your numbers', ['Revenue, cost per chair hour and margin per procedure', 'The five numbers to look at every week', 'A dashboard in an afternoon']),
      M('Module 2 · Pricing', ['Pricing from cost and chair time, not from the clinic next door', 'Packages and payment plans', 'Saying the price without apologising']),
      M('Module 3 · Front desk flow', ['Booking, reminders and no-shows', 'Intake that takes two minutes', 'Recall lists that fill the diary']),
      M('Module 4 · Inventory and equipment', ['Par levels and reorder points', 'Maintenance schedules for chairs, compressors and x-rays', 'When to repair, when to replace']),
      M('Module 5 · People', ['Hiring and onboarding assistants', 'Payroll, biometrics and fairness', 'A team that runs the day without you']),
      M('Module 6 · DentaDesk', ['Set up your clinic in DentaDesk', 'Patients, visits, payments and reports', 'Your data, exportable, always yours']),
    ],
  },
};
