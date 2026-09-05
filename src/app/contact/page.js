import PageCinema from '@/components/cinema-pages/PageCinema';
import ShowroomInfo from '@/components/contact/ShowroomInfo';
import BookingForm from '@/components/contact/BookingForm';
import contactBeats from '@/components/cinema-pages/contact-beats.json';

export const metadata = {
  title: 'Contact & Showroom',
  description: 'Visit our 140 sqm showroom in Pasig City or book a free consultation. Mon–Sun 9AM–8PM. Call +63 962 579 3024.',
};

// The five beat Contact arc, then the Details region: the real ShowroomInfo and the real
// BookingForm, untouched and still wired to their server action. Beats 1 and 2 are the
// doors into them, which is why their CTAs are in-page anchors.
//
// #showroom is load bearing: the home arc's door sends Visit the showroom here.
// Everything sits inside <main> so the music room hides it all together.
export default function ContactPage() {
  return (
    <main>
      <PageCinema beats={contactBeats.beats} />
      <div className="dsd-below">
        <section id="showroom" className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[45%]"><ShowroomInfo /></div>
          <div className="w-full lg:w-[55%]" id="inquiry"><BookingForm /></div>
        </section>
      </div>
    </main>
  );
}
