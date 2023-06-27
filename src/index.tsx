import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ROUTES } from "~/const";

import MainPage from "~/pages/MainPage";

import './index.less';

const container = document.getElementById('app') || document.body;
const root = createRoot(container);

// render
root.render(
	<StrictMode>
		<Router>
			<Routes>
				<Route path={ROUTES.ROOT} element={<MainPage />} />
			</Routes>
		</Router>
	</StrictMode>,
);
