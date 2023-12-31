import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ROUTES } from "~/const";

import PageLayout from "~/components/PageLayout";

import MainPage from "~/pages/MainPage";
import QuickLotteriesPage from "~/pages/QuickLotteriesPage";
import TicketsPage from "~/pages/TicketsPage";
import MyBetsPage from "~/pages/MyBetsPage";
import MyProfilePage from "~/pages/MyProfilePage";

// hry
import SportkaBetPage from "~/pages/SportkaBetPage";
import KorunkaNa3BetPage from "~/pages/KorunkaNa3BetPage";
import KorunkaNa4BetPage from "~/pages/KorunkaNa4BetPage";
import KorunkaNa5BetPage from "~/pages/KorunkaNa5BetPage";
import Rychla6BetPage from "~/pages/Rychla6BetPage";
import RychleKackyBetPage from "~/pages/RychleKackyBetPage";
import StistkoBetPage from "~/pages/StistkoBetPage";
import Stastnych10BetPage from "~/pages/Stastnych10BetPage";
import DicesPage from "~/pages/DicesPage";

import './index.less';

const container = document.getElementById('app') || document.body;
const root = createRoot(container);

// render
root.render(
	<StrictMode>
		<Router>
			<Routes>
				<Route element={<PageLayout />}>
					<Route path={ROUTES.QUICK} element={<QuickLotteriesPage />} />
					<Route path={ROUTES.TICKETS} element={<TicketsPage />} />
					<Route path={ROUTES.MY_BETS} element={<MyBetsPage />} />
					<Route path={ROUTES.MY_PROFILE} element={<MyProfilePage />} />
					<Route path={ROUTES.SPORTKA} element={<SportkaBetPage />} />
					<Route path={ROUTES.KORUNKA_NA3} element={<KorunkaNa3BetPage />} />
					<Route path={ROUTES.KORUNKA_NA4} element={<KorunkaNa4BetPage />} />
					<Route path={ROUTES.KORUNKA_NA5} element={<KorunkaNa5BetPage />} />
					<Route path={ROUTES.RYCHLA6} element={<Rychla6BetPage />} />
					<Route path={ROUTES.RYCHLE_KACKY} element={<RychleKackyBetPage />} />
					<Route path={ROUTES.STISTKO5} element={<StistkoBetPage variant="stistko5" />} />
					<Route path={ROUTES.STISTKO10} element={<StistkoBetPage variant="stistko10" />} />
					<Route path={ROUTES.STISTKO20} element={<StistkoBetPage variant="stistko20" />} />
					<Route path={ROUTES.STASTNYCH10} element={<Stastnych10BetPage />} />
					<Route path={ROUTES.DICES} element={<DicesPage />} />
					<Route path="*" element={<MainPage />} />
				</Route>
			</Routes>
		</Router>
	</StrictMode>,
);
