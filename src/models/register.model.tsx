export default interface RegisterModel {
  companyName: string;
  email: string;
  areaOfActivity: string;
  cel:number | null;
  password: string;
  confirmPassword: string;
}