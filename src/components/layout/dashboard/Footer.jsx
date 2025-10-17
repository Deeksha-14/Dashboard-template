import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function Footer({ brandName = "QACC", brandLink = "#", routes = [] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}, made with <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" /> by{" "}
          <a href={brandLink} className="font-bold hover:text-blue-500">{brandName}</a>
        </Typography>
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <a href={path} target="_blank" className="text-sm hover:text-blue-500">{name}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};
