"use client"
import { useEffect, useState } from "react";
import {supabase} from "@accounts/_supabase/client";

const BatchesStrength = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const getBatchedInfo = async () => {
          let {data, error} = await supabase.rpc(
              'get_active_training_course_student_count_f'
          )
          if(error) 
              setError(error);
          else {
              setBatches(data);
          }
      }
      setIsLoading(true);
      getBatchedInfo();
      setIsLoading(false);
  }, []);

  if(isLoading)
    return <p>Loading ...</p>
  else if(error)
    return <p>{JSON.stringify(error, null, 2)}</p>
  else if(!batches.length)
    return <p>No Batch Found!</p>

  return(
    <>
    <h3>Batches Strength</h3>
    <p>List of all ACTIVE batches with student count</p>
    <ol>
    {batches.map(course => (
      <li key={course.training_course_id}>
        [{course.course_batch}] {" "}
        {course.course_nick} = {course.student_count}
      </li>
    ))}
  </ol>
  <p>Total student count = {batches[0].total_student_count}</p>
  </>
  )
}

const ReceiptsBatchWiseBreakdown = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPaymentsInfo = async () => {
        let {data, error} = await supabase.rpc(
            'get_fee_receipts_current_month_orderby_course_f'
        )
        if(error) 
            setError(error);
        else {
            setPayments(data);
        }
    }
    setIsLoading(true);
    getPaymentsInfo();
    setIsLoading(false);
  }, []);

  if(isLoading)
    return <p>Loading ...</p>
  else if(error)
    return <p>{JSON.stringify(error, null, 2)}</p>
  else if(!payments.length)
    return <p>No Payment Found!</p> 

  return (
    <>
    <p>Batch wise Receipts for Past X Days: Current Month Receipts: {new Date().toLocaleString('default', { month: 'long' })} </p>
    <ol>
    {payments.map(p => (
      <li key={p.training_course_id}>
        [{p.training_course_batch}] {" "}
        {p.training_course_nick} = {p.total_fee_installments}
      </li>
    ))}
  </ol>
  <p>Total student count = {payments[0].sum_total_fee_installments}</p>
    </>
  )
}

const getReceiptsOfDay = (day, receipts) => {
  return receipts.filter(receipt => 
    receipt.payment_date.startsWith(day)
  );
}

const ReceiptsDayWiseBreakdown = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastDays, setLastDays] = useState(15);

  const getData = async () => {
    setIsLoading(true);
    let { data, error } = await supabase.rpc(
      'get_fee_data', { last_days: lastDays}
    );
    if(error) 
        setError(error);
    else {
        setData(data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  if(isLoading)
    return <p>Loading ...</p>
  else if(error)
    return <p>{JSON.stringify(error, null, 2)}</p>
  else if(!data)
    return <p>No Data Found!</p>

  const totalAmount = data.total_amount;
  const daySummary = data.fee_summary;
  const receipts = data.received_installments;

  return (
    <>
    <p>Receipts form last {lastDays} days till now</p>
    
    <form onSubmit={e => {
      e.preventDefault();
      getData();
    }}>
    <input value={lastDays} onChange={e => setLastDays(e.target.value)}/>
    <button type="submit">submit</button>
    </form>
    
    <p>
      Total Amount = Rs. {totalAmount}, 
      Total Receipts = {receipts.length},
      Average Receipt = Rs. {(totalAmount / receipts.length).toFixed(0)}
      <br />
      From = {daySummary[0]?.payment_day},
      To = {daySummary[daySummary?.length - 1]?.payment_day}
    </p>

    <h3>Day wise Breakdown</h3>
    <ol>
    {daySummary.map((f, i) => {
      const dayReceipts = getReceiptsOfDay(f.payment_day, receipts);
      return (
        <li key={i}>
          {JSON.stringify(f, null, 2)}
          Receipts: {dayReceipts.length}
          <ul>
          {dayReceipts.map(r => 
            <li key={r.id}>{JSON.stringify(r, null, 2)}</li>
          )}
          </ul>
        </li>)
    })}
    </ol>

    <h3>Batch wise Breakdown</h3>
    <ReceiptsBatchWiseBreakdown />
    </>
  )
}

export default function Dashboard(){
    return(
      <>
      <ReceiptsDayWiseBreakdown />
      <hr />
      <BatchesStrength />
      </>
    )
}