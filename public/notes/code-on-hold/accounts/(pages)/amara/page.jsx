import React from "react";

export default function Amara() {
  return (
    <div style={{ margin: "16px" }}>
      <h2>Miss Amara Tasks</h2>
      <hr />

      <h2>Daily: Fee Collection</h2>
      <p>
        Followup: Send/call reminder to fee defaulters
        <a href="https://nexusberry-crm-strapi4.onrender.com/admin/content-manager/collection-types/api::fee-installment.fee-installment?page=1&pageSize=20&sort=dueDate:ASC&filters[$and][0][status][$eq]=Pending&filters[$and][1][dueDate][$gte]=2024-04-30T19:00:00.000Z&filters[$and][2][dueDate][$lte]=2024-05-30T19:00:00.000Z" target="_blank">This Month Pending</a>
        </p>
      <p>Followup update dueDate if required</p>
      <p>
        Record: Save/Add fee payments (new/installment) received in software
      </p>
      <hr />
      <h2> Daily: Classes and Groups Management</h2>
      <p>
        Class Start: Make Links of all classes and schedule in GCR (today and
        tomorrow)
      </p>
      <p>
        Class Attendance: Add class/teacher attendance in software
        (couseAttendance)
      </p>
      <br />
      <p>
        Student Add: add new admission to Fee, Whatsapp group and Google
        classroom
      </p>
      <p>
        Student Remove: Remove/block left/defaulter from Whatsapp group and
        Google classroom
      </p>
      <br />
      
      <p>Group New: when a new btach starts, make its whatsapp group + GCR</p>
      <p>
        Group Close: when a new btach end, whatsapp group (rename & admin only)
        + GCR (rename & archieve)
      </p>
      <h4>*Perfect Match* strapi record = whatsgroup = google classroom</h4>
      <hr />

      <h2>Daily: Meta Page Management</h2>
      <p>1&#41; Meta Business Inbox</p>
      <a href="https://business.facebook.com/latest/inbox/all" target="_blank">
        https://business.facebook.com/latest/inbox/all
      </a>
      <p>response time</p>
      <p></p>
      <p>sensible reply</p> quality communication
      <p>keep record</p>
      <p>2&#41; Grow your audience:</p>
      <a href="https://business.facebook.com/latest/home" target="_blank">
        https://business.facebook.com/latest/home
      </a>
      <p>Reach out to your existing network</p>
      <p>Reach out to people who interacted with your content</p>
      <hr />
      
      <h2>Daily: Expense Record</h2>
      <p>record all expenses made in detail</p>
      <hr />
      
      <h1>Monthly: Salary Calculation </h1>
      <p>Calculate, Distribute and Record Salary of Staff & Faculty</p>
      <hr />
    </div>
  );
}