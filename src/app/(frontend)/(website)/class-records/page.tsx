"use client"
import { useState } from "react"

export default function ManualEmployeeData() {
    const [employees, setEmployees] = useState([
        { id: "1", name: "John Doe", designation: "Trainer", perClassRate: 2000, classesAttended: 0 },
        { id: "2", name: "Sarah Smith", designation: "Manager", perClassRate: 2500, classesAttended: 0 },
        { id: "3", name: "Mike Johnson", designation: "Supervisor", perClassRate: 1800, classesAttended: 0 },
        { id: "4", name: "Emma Wilson", designation: "Trainer", perClassRate: 2200, classesAttended: 0 }
    ])

    const [month, setMonth] = useState("2025-08")

    const handleClassChange = (id: string, value: number) => {
        setEmployees(prev => prev.map(emp =>
            emp.id === id ? { ...emp, classesAttended: Math.max(0, value) } : emp
        ))
    }

    const calculateTotalFees = (rate: number, classes: number) => {
        return rate * classes
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Employee Monthly Data</h2>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="month-select" style={{ marginRight: '10px' }}>Select Month:</label>
                <input
                    type="month"
                    id="month-select"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    style={{ padding: '5px' }}
                />
            </div>

            <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                        <th>Employee Name</th>
                        <th>Designation</th>
                        <th>Per Class Rate</th>
                        <th>Classes Attended</th>
                        <th>Total Fees</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.designation}</td>
                            <td>{emp.perClassRate.toLocaleString()}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    value={emp.classesAttended}
                                    onChange={(e) => handleClassChange(emp.id, parseInt(e.target.value) || 0)}
                                    style={{ width: '60px', padding: '5px' }}
                                />
                            </td>
                            <td>{calculateTotalFees(emp.perClassRate, emp.classesAttended).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ddd' }}>
                <h3>Summary for {month}</h3>
                <p>Total Employees: {employees.length}</p>
                <p>Total Classes: {employees.reduce((sum, emp) => sum + emp.classesAttended, 0)}</p>
                <p>Total Fees Payable: {employees.reduce((sum, emp) => sum + calculateTotalFees(emp.perClassRate, emp.classesAttended), 0).toLocaleString()}</p>
            </div>
        </div>
    )
}