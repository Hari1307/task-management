"use client"

export default function SigninForm() {
    // const [formData, setFormData] = useState({ email: '', password: '' });
    // // const router = useRouter();
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const response = await fetch('/api/signin', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(formData),
    //     });
    //     const data = await response.json();
    //     if (response.ok) {
    //         localStorage.setItem('token', data.token);
    //         // alert('Sign in successful');
    //         // router.push("/dashboard");
    //     } else {
    //         alert(data.message);
    //     }
    // };

    return (
        <h1>signin page</h1>
        // <form onSubmit={handleSubmit}>
        //     <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        //     <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        //     <button type="submit">Sign In</button>
        // </form>
    );
}
