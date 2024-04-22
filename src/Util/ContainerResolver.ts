import { container } from "tsyringe";
export default function containerResolver(resolveClass) {
  return container.resolve(resolveClass);
}
