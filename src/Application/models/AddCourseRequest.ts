export default class AddCourseRequest {
  constructor(
    public name: string,
    public instructorName: string,
    public price: number
  ) {}
}
