

export const BASE_URL = "http://localhost:8080"

export const SignInAPI = `${BASE_URL}/api/v1/users/signIn`
export const SignUpAPI = `${BASE_URL}/api/v1/users/signUp`
export const CreateWorkflowAPI = `${BASE_URL}/api/v1/workflow/create`
export const UpdateWorkflowAPI = `${BASE_URL}/api/v1/workflow/update/:id`
export const GetAllWorkflowAPI = `${BASE_URL}/api/v1/workflow/getAll`
export const DeleteWorkflowAPI = `${BASE_URL}/api/v1/workflow/delete/:id`
