// Growth Partner page data: the eight tracks, the partners, the curated media.
// Media files are listed in second-brain/builds/dsd-growth-partner/media-manifest.md with inclusion reasons.

export const TRACKS = [
  { id: 'digital', label: 'Digital Dentistry', icon: '/images/training/digital-dentistry.png', promise: 'Intraoral scanning, CAD and CAM, and guided workflows on the same scanners and chairs you can buy downstairs.', leave: 'You leave with a scan-to-design workflow you can run on Monday.' },
  { id: 'assistant', label: 'Dental Assistant Training', icon: '/gp/logos/ffc-ring-clean.png', plate: true, promise: 'Chairside skills for your team: infection control, instruments, four-handed assisting, front desk flow.', leave: 'Your assistants leave certified in the way your clinic actually runs.', with: { name: 'FFC Dental Clinic', logo: '/gp/logos/ffc-ring-clean.png' } },
  { id: 'ortho', label: 'Orthodontics', icon: '/gp/logos/cred-orthostrategy.png', plate: true, promise: 'Mini screws and TADs, hands-on, with the Orthostrategy Study Group.', leave: 'You leave having placed TADs on the simulator under a mentor.', with: { name: 'Orthostrategy Study Group', logo: '/gp/logos/cred-orthostrategy.png' } },
  { id: 'endo', label: 'Endodontics', icon: '/images/training/endodontics.png', promise: 'Rotary systems, apex locators, and obturation on Denjoy equipment.', leave: 'You leave with a faster, calmer canal.', with: { name: 'Denjoy', logo: '/images/brand/denjoy-logo-final.png' } },
  { id: 'prostho', label: 'Prosthodontics', icon: '/images/training/prosthodontics.png', promise: 'Preparation, impression, and digital design for crowns and bridges that fit the first time.', leave: 'You leave with cases planned end to end.' },
  { id: 'surgery', label: 'Oral Surgery', icon: '/images/training/oral-surgery.png', promise: 'Surgical fundamentals and implant planning with the Crest Study Group.', leave: 'You leave knowing which cases to take and which to refer.', with: { name: 'Crest Study Group', logo: '/gp/logos/cred-creststudy-round.png' } },
  { id: 'aesthetics', label: 'Aesthetics', icon: '/images/training/aesthetics.png', promise: 'Shade, composite layering, and smile design with the tools we demonstrate in the showroom.', leave: 'You leave with a before and after you are proud to post.' },
  { id: 'business', label: 'Practice Business and DentaDesk', icon: '/images/training/business.png', promise: 'Running the clinic as a business, and DentaDesk, a free app for your own clinic on Mac, Windows, iOS, and Android.', leave: 'You leave with your numbers in one place and a plan for the year.', platforms: true },
];

export const PARTNERS = [
  { name: 'Orthostrategy Study Group', sub: 'Orthodontic TADs hands-on training', logo: '/gp/logos/cred-orthostrategy.png', shape: 'plate' },
  { name: 'Crest Study Group', sub: 'Digital dentistry and surgery study group', logo: '/gp/logos/cred-creststudy-round.png', shape: 'round' },
  { name: 'FFC Dental Clinic', sub: 'Dental Assistant Training', logo: '/gp/logos/ffc-ring-clean.png', shape: 'round' },
  { name: 'JDev Studio', sub: 'Software and agentic engineering', logo: '/gp/logos/cred-jdev-round.png', shape: 'round' },
  { name: 'ROSON', sub: 'Exclusive distributor, largest showroom in the country', logo: '/images/brand/roson-logo-final.png', shape: 'plate' },
  { name: 'Denjoy', sub: 'Endodontic systems', logo: '/images/brand/denjoy-logo-final.png', shape: 'plate' },
];

export const REELS = [
  { src: '/gp/reels/reel-07.mp4', poster: '/gp/reels/reel-07.jpg', cap: 'Scanner workstation, live design on the screen' },
  { src: '/gp/reels/reel-09.mp4', poster: '/gp/reels/reel-09.jpg', cap: 'Mentor at your shoulder while you work on the simulator' },
  { src: '/gp/reels/reel-12.mp4', poster: '/gp/reels/reel-12.jpg', cap: 'TADs lecture and workshop, batch one' },
  { src: '/gp/reels/reel-10.mp4', poster: '/gp/reels/reel-10.jpg', cap: 'Shade matching with the device, not the eye' },
];

export const PHOTOS = [
  { src: '/gp/photos/venue-08.jpg', cap: 'Lecture and hands-on in one room', wide: true },
  { src: '/gp/photos/scan-08.jpg', cap: 'Digital models on every screen', wide: true },
  { src: '/gp/photos/scan-03.jpg', cap: 'Scanning on the simulator' },
  { src: '/gp/photos/venue-04.jpg', cap: 'Group at the chair' },
  { src: '/gp/photos/scan-06.jpg', cap: 'Mentor and trainee' },
  { src: '/gp/photos/venue-01.jpg', cap: 'Instructor at the screen' },
  { src: '/gp/photos/scan-07.jpg', cap: 'Intraoral scanner, live' },
  { src: '/gp/photos/venue-10.jpg', cap: 'Hands-on at the chair' },
  { src: '/gp/photos/venue-09.jpg', cap: 'A full room' },
  { src: '/gp/photos/studio-01.jpg', cap: 'Our studio, where the courses are filmed' },
  { src: '/gp/photos/showroom-session.jpg', cap: 'Showroom session with the ROSON team' },
  { src: '/gp/photos/hands-on-service.jpg', cap: 'Technical training on the chairs we sell' },
  { src: '/gp/photos/team-workshop.jpg', cap: 'Team workshop' },
  { src: '/gp/photos/roson-qc-lab.jpg', cap: 'Where the chairs are tested' },
];
