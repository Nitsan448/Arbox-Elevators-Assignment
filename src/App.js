import { Routes, Route, Navigate } from "react-router-dom";
import Settings from "./pages/Settings";
import Elevators from "./pages/Elevators";
import NotFound from "./pages/NotFound";

function App() {
	return (
		<main>
			<Routes>
				<Route path="/" element={<Navigate replace to="/settings" />} />

				<Route path="/settings" element={<Settings />} />

				<Route path="/elevators" element={<Elevators />} />

				<Route path="*" element={<NotFound />} />
			</Routes>
		</main>
	);
}

export default App;
