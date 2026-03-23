import ShowroomInfo from '@/components/contact/ShowroomInfo';
import BookingForm from '@/components/contact/BookingForm';

export const metadata = {
  title: 'Contact & Showroom',
  description: 'Visit our 140 sqm showroom in Pasig City or book a free consultation. Mon–Sun 9AM–8PM. Call +63 962 579 3024.',
};

export default function ContactPage() {
  return (
    <main className="w-full min-h-screen bg-white selection:bg-[#10b981] selection:text-white pt-[72px]">
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
        <div className="w-full lg:w-[45%] lg:fixed lg:left-0 lg:top-[72px] lg:bottom-0"><ShowroomInfo /></div>
        <div className="w-full lg:w-[55%] lg:ml-[45%] min-h-screen lg:min-h-0"><BookingForm /></div>
      </div>
    </main>
  );
}
