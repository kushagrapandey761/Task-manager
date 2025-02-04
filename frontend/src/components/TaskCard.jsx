export default function TaskCard({
  title,
  description,
  dueDate,
  priority,
  
}) {
  if(description.length>=90){
    description = description.substring(0,91)+"........";
  }
  return (
    <div
      className={`${
        priority === "High"
          ? "bg-[#D84040]"
          : priority === "Medium"
          ? "bg-[#FBA518]"
          : "bg-[#5CB338]"
      } p-4 m-2 rounded-lg shadow-lg w-[250px] hover:cursor-pointer`}
    >
      <h3 className="font-bold text-lg font-arima">{title}</h3>
      <p className="text-sm text-white">{description}</p>
      <p className="text-sm text-white">
        Due Date: {new Date(dueDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-white">Priority: {priority}</p>
    </div>
  );
}
