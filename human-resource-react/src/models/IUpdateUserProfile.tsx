export interface IUpdateUserProfile {
    name: string
    surname: string
    phone: string
    title: string
    location: string
    birthDate: string
    position: string
    photo: File | null
}