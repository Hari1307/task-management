"use client"

export default function SignupForm() {
    // const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const response = await fetch('/api/signup', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(formData),
    //     });
    //     const data = await response.json();
    //     alert(data.message);
    // };

    return (
        <div>
            signup page
        </div>
        // <form onSubmit={handleSubmit}>
        //     <input type="text" placeholder="Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        //     <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        //     <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        //     <button type="submit">Sign Up</button>
        // </form>
    );
}
