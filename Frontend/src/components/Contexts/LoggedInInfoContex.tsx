import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState,
} from "react";
import Cookies from "universal-cookie";

export type LoggedInInfo = {
  userId: number;
  username: string;
  role: string;
};

export type LoggedInInfoContextType = {
  loggedInInfo: LoggedInInfo | undefined;
  setLoggedInInfo: Dispatch<React.SetStateAction<LoggedInInfo | undefined>>;
};

const LoggedInInfoContext = createContext<LoggedInInfoContextType | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export const LoggedInInfoContextProvider = ({ children }: Props) => {
  let initialInfo: LoggedInInfo | undefined = undefined;

  const cookies = new Cookies();
  const userId = cookies.get("loggedInUserId");
  const username = cookies.get("loggedInUsername");
  const role = cookies.get("loggedInRole");

  if (userId && username && role) {
    initialInfo = {
      userId: parseInt(userId, 10),
      username: username,
      role: role,
    };
  }

  const [loggedInInfo, setLoggedInInfo] = useState<LoggedInInfo | undefined>(
    initialInfo
  );

  return (
    <LoggedInInfoContext.Provider value={{ loggedInInfo, setLoggedInInfo }}>
      {children}
    </LoggedInInfoContext.Provider>
  );
};

export default LoggedInInfoContextProvider;

export function useLoggedInInfoContext() {
  const context = useContext(LoggedInInfoContext);
  if (!context)
    throw Error(
      "useLoggedInInfoContext must be within LoggedInInfoContextProvider"
    );
  return context;
}
