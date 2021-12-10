import { Controller, useForm } from "react-hook-form";
import { motion } from "framer-motion";

import DateTimePicker from "react-datetime-picker/dist/entry.nostyle";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";

const ease = [0.43, 0.13, 0.23, 0.96];

const stepVariants = {
  initial: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8, delay: 0.5 },
  },
  animate: {
    y: "0%",
    opacity: 1,
    transition: { ease, duration: 0.8 },
  },
  exit: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8},
  },
};

export default function QuizDetailForm({ updateFormData }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <motion.div
      variants={stepVariants}
      className="bg-gray-100 flex flex-col p-8 rounded-lg"
    >
      <form onSubmit={handleSubmit(updateFormData)}>
        <div className="mb-4">
          <label className="text-gray-700 font-bold mb-2" htmlFor="name">
            Name of Quiz
          </label>
          <input
            {...register("quiz_name")}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="quiz_name"
            type="text"
            placeholder="Some amazing name for your quiz"
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-bold mb-2" htmlFor="name">
            Prize Money
          </label>
          <input
            {...register("prize_money")}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="prize_money"
            type="number"
            step="any"
            placeholder="in Ether"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Message
            <textarea
              {...register("message")}
              className="shadow form-textarea mt-1 block w-full border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="5"
              placeholder="Some info for players (optional)"
            ></textarea>
          </label>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="datetime"
          >
            Choose your Date and Time
          </label>
          <Controller
            control={control}
            name="date_input"
            defaultValue={new Date()}
            render={({ field }) => {
              return (
                <DateTimePicker
                  required
                  amPmAriaLabel="Select AM/PM"
                  calendarAriaLabel="Toggle calendar"
                  clearAriaLabel="Clear value"
                  dayAriaLabel="Day"
                  hourAriaLabel="Hour"
                  maxDetail="second"
                  minuteAriaLabel="Minute"
                  monthAriaLabel="Month"
                  nativeInputAriaLabel="Date and time"
                  secondAriaLabel="Second"
                  yearAriaLabel="Year"
                  className="shadow bg-white"
                  calendarClassName="rounded"
                  clockClassName="rounded"
                  onChange={field.onChange}
                  value={field.value}
                />
              );
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="transition ease-in-out duration-300 bg-blue-500 hover:bg-indigo-500 hover:scale-105 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Lets create questions
          </button>
        </div>
      </form>
    </motion.div>
  );
}
