import React from 'react'
import ReachUsSection from './_components/ReachUsSection';
import Location from './_components/Location';

const ContactUsPage = () => {
  return (
    <div className='m-8'>
      {/* <Hero
        title="Contact Us"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us", href: "/contact-us" }
        ]}
        image={heroCourse2}
      /> */}
      <ReachUsSection />
      <Location />
    </div>
  )
}

export default ContactUsPage;
