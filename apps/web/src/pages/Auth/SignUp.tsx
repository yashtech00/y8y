import { useState } from "react";
import { SignUpAPI } from "../../constants/ConstantApi";
import { Link, useNavigate } from "react-router-dom";



interface ISignUp {
    email: string;
    password: string;
}

export default function SignUp() {
    const [formData, setFormData] = useState<ISignUp>({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log('Attempting to sign up with:', { email: formData.email });
            
            const response = await fetch(SignUpAPI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            }).catch((fetchError) => {
                console.error('Fetch error:', fetchError);
                throw new Error(`Network error: ${fetchError.message}`);
            });

            console.log('Response status:', response.status);
            
            let data;
            try {
                data = await response.json().catch(() => ({}));
            } catch (jsonError) {
                console.error('JSON parse error:', jsonError);
                throw new Error('Invalid response from server');
            }
            
            console.log('Response data:', data);

            if (!response.ok) {
                const errorMessage = data?.message || 
                                 data?.error || 
                                 `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const authHeader = response.headers.get('Authorization') || '';
            const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

            if (!token) {
                console.warn('No token in response headers:', response.headers);
                throw new Error('No token found in response headers');
            }

            localStorage.setItem("token", token);
            navigate("/workflows");

        } catch (err) {
            console.error('Sign up error:', {
                error: err,
                message: err instanceof Error ? err.message : 'Unknown error',
                time: new Date().toISOString()
            });
            setError(err instanceof Error ? 
                (err.message || 'Failed to create account. Please try again.') : 
                'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-card border border-border">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Or{' '}
                        <Link to="/signin" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            sign in to your account
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-destructive" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-destructive-foreground">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-foreground">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-border bg-background text-foreground rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-border bg-background text-foreground rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="text-sm">
                        <p className="text-muted-foreground">
                            By signing up, you agree to our{' '}
                            <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Privacy Policy
                            </a>.
                        </p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-primary'}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </>
                            ) : 'Sign up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}