"use client"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { ToastContainer } from "react-toastify";

export default function Dashboard() {
    const [userData, setUserData] = useState<any[]>([]);
    const [newTask, setNewTask] = useState({
        title: "",
        priority: "",
        status: "",
        startTime: null as Dayjs | null,
        endTime: null as Dayjs | null
    });
    const [updatedData, setUpdatedData] = useState({
        id: "",
        title: "",
        priority: "",
        status: "",
        startTime: null as Dayjs | null,
        endTime: null as Dayjs | null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [updateModelVisible, setUpdateModelVisible] = useState(false);
    const [createModelVisible, setCreateModelVisible] = useState(false);
    const router = useRouter();

    const createTask = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }
        setIsLoading(true);

        try {
            const createPayload = {
                ...newTask,
                priority: Number(newTask.priority),
                startTime: newTask.startTime ? newTask.startTime.toISOString() : null,
                endTime: newTask.endTime ? newTask.endTime.toISOString() : null
            };

            const response = await axios.post("/api/task", createPayload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCreateModelVisible(false);

            setNewTask({
                title: "",
                priority: "",
                status: "",
                startTime: null,
                endTime: null
            });

        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const deleteTask = async (taskId: any) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }
        try {
            const response = await axios.delete(`/api/task/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsLoading(true);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const updateTask = async (id: any) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }
        try {
            const updatePayload = {
                ...updatedData,
                startTime: updatedData.startTime ? updatedData.startTime.toISOString() : null,
                endTime: updatedData.endTime ? updatedData.endTime.toISOString() : null
            };

            await axios.put(`/api/task/${id}`, updatePayload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUpdateModelVisible(false);
            setIsLoading(true);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }
        try {
            const response = await axios.get("/api/", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(response.data.user.tasks);
        } catch (error) {
            router.push("/");
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [updateModelVisible, createModelVisible]);

    const columns: TableColumn<any>[] = [
        {
            name: "Task ID",
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: "Title",
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: "Priority",
            selector: (row) => row.priority,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
        },
        {
            name: "Start Time",
            selector: (row) => new Date(row.startTime).toLocaleString(),
            sortable: true,
        },
        {
            name: "End Time",
            selector: (row) => new Date(row.endTime).toLocaleString(),
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-3">
                    <button
                        onClick={() => deleteTask(row.id)}
                        style={{
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Delete
                    </button>

                    <button
                        onClick={() => {
                            setUpdatedData({
                                ...row,
                                startTime: row.startTime ? dayjs(row.startTime) : null,
                                endTime: row.endTime ? dayjs(row.endTime) : null
                            });
                            setUpdateModelVisible(true);
                        }}
                        style={{
                            backgroundColor: "green",
                            color: "#fff",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Update
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-4 float-end ">
                <button
                    onClick={() => setCreateModelVisible(true)}
                    style={{
                        backgroundColor: "blue",
                        color: "#fff",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Create New Task
                </button>
            </div>
            <ToastContainer />
            {
                userData ? (
                    <>
                        {/* <h1 className="text-center bold">User Tasks</h1> */}
                        <DataTable
                            columns={columns}
                            data={userData}
                            pagination
                            responsive
                            highlightOnHover
                            striped
                            dense
                            customStyles={{
                                table: {
                                    style: {
                                        width: '90%',
                                        margin: '0 auto',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        backgroundColor: '#fff',
                                    }
                                },
                                headCells: {
                                    style: {
                                        backgroundColor: "#007bff",
                                        color: '#fff',
                                        fontFamily: "Arial, sans-serif",
                                        fontWeight: 'bold',
                                        fontSize: "16px",
                                        padding: '12px 16px',
                                        textAlign: 'center',
                                    },
                                },
                                cells: {
                                    style: {
                                        fontSize: "14px",
                                        padding: "12px 16px",
                                        color: "#555",
                                        backgroundColor: "#f9f9f9",
                                        borderBottom: '1px solid #ddd',
                                        transition: 'background-color 0.3s ease',
                                    }
                                },
                                pagination: {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginTop: '20px',
                                        padding: '10px',
                                        backgroundColor: '#f1f1f1',
                                    }
                                },

                            }}
                        />
                    </>
                ) : (
                    <p>Loading data...</p>
                )
            }

            {
                createModelVisible && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "#fff",
                                padding: "20px",
                                borderRadius: "8px",
                                width: "400px",
                            }}
                        >
                            <h2>Create New Task</h2>

                            <form>
                                <div style={{ marginBottom: "10px" }}>
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) =>
                                            setNewTask({ ...newTask, title: e.target.value })
                                        }
                                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                                    />
                                </div>

                                <div style={{ marginBottom: "10px" }}>
                                    <label>Priority</label>
                                    <input
                                        type="text"
                                        value={newTask.priority}
                                        onChange={(e) =>
                                            setNewTask({ ...newTask, priority: e.target.value })
                                        }
                                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                                    />
                                </div>

                                <div style={{ marginBottom: "10px" }}>
                                    <label>Status</label>
                                    <input
                                        type="text"
                                        value={newTask.status}
                                        onChange={(e) =>
                                            setNewTask({ ...newTask, status: e.target.value })
                                        }
                                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                                    />
                                </div>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <div style={{ marginBottom: "10px" }}>
                                        <label>Start Time</label>
                                        <DateTimePicker
                                            value={newTask.startTime}
                                            onChange={(date) =>
                                                setNewTask({ ...newTask, startTime: date })
                                            }
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    style: { marginBottom: "10px" },
                                                },
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: "10px" }}>
                                        <label>End Time</label>
                                        <DateTimePicker
                                            value={newTask.endTime}
                                            onChange={(date) =>
                                                setNewTask({ ...newTask, endTime: date })
                                            }
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    style: { marginBottom: "10px" },
                                                },
                                            }}
                                        />
                                    </div>
                                </LocalizationProvider>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <button
                                        type="button"
                                        onClick={() => setCreateModelVisible(false)}
                                        style={{
                                            backgroundColor: "gray",
                                            color: "#fff",
                                            padding: "8px 12px",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Close
                                    </button>

                                    <button
                                        type="button"
                                        onClick={createTask}
                                        disabled={isLoading}
                                        style={{
                                            backgroundColor: isLoading ? "gray" : "green",
                                            color: "#fff",
                                            padding: "8px 12px",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: isLoading ? "not-allowed" : "pointer",
                                        }}
                                    >
                                        {isLoading ? "Creating..." : "Create Task"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {
                updateModelVisible && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "#fff",
                                padding: "20px",
                                borderRadius: "8px",
                                width: "400px",
                            }}
                        >
                            <h2>Update Task</h2>

                            <form>
                                <div style={{ marginBottom: "10px" }}>
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={updatedData.title}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, title: e.target.value })
                                        }
                                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                                    />
                                </div>

                                <div style={{ marginBottom: "10px" }}>
                                    <label>Priority</label>
                                    <input
                                        type="text"
                                        value={updatedData.priority}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, priority: e.target.value })
                                        }
                                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                                    />
                                </div>

                                <div style={{ marginBottom: "10px" }}>
                                    <label>Status</label>
                                    <input
                                        type="text"
                                        value={updatedData.status}
                                        onChange={(e) =>
                                            setUpdatedData({ ...updatedData, status: e.target.value })
                                        }
                                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                                    />
                                </div>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <div style={{ marginBottom: "10px" }}>
                                        <label>Start Time</label>
                                        <DateTimePicker
                                            value={updatedData.startTime}
                                            onChange={(date) =>
                                                setUpdatedData({ ...updatedData, startTime: date })
                                            }
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    style: { marginBottom: "10px" },
                                                },
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: "10px" }}>
                                        <label>End Time</label>
                                        <DateTimePicker
                                            value={updatedData.endTime}
                                            onChange={(date) =>
                                                setUpdatedData({ ...updatedData, endTime: date })
                                            }
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    style: { marginBottom: "10px" },
                                                },
                                            }}
                                        />
                                    </div>
                                </LocalizationProvider>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <button
                                        type="button"
                                        onClick={() => setUpdateModelVisible(false)}
                                        style={{
                                            backgroundColor: "gray",
                                            color: "#fff",
                                            padding: "8px 12px",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Close
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateTask(updatedData.id)}
                                        disabled={isLoading}
                                        style={{
                                            backgroundColor: "green",
                                            color: "#fff",
                                            padding: "8px 12px",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div >
                )
            }
        </div >
    );
}
