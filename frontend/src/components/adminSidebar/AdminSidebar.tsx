import "./adminSidebar.css";
import React from "react";
import { Link } from "react-router-dom";
import { Insights, Paid, PermIdentity, TrendingDown, TrendingUp } from "@mui/icons-material";

export const AdminSidebar: React.FC = () => {
    return (
        <div className="adminSidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Home</h3>
                    <ul className="sidebarList">
                        <div className="sidebarListContainer">
                            <Link to="/admin-homepage" className="link sidebarListContainer">
                                <li className="sidebarListItem">
                                    <Insights className="sidebartIcon"/>
                                    <div className="sidebarIconName">Dashboard</div>
                                </li>
                            </Link>
                        </div>
                    </ul>  
                </div>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Products</h3>
                    <ul className="sidebarList">
                        <div className="sidebarListContainer">
                            <Link to="/admin-sales" className="link sidebarListContainer">
                                <li className="sidebarListItem">
                                    <TrendingUp className="sidebarIcon"/>
                                    <div className="sidebarIconName">Sales</div>
                                </li>
                            </Link>
                        </div>
                        <div className="sidebarListContainer">
                            <Link to="/admin-products" className="link sidebarListContainer">
                                <li className="sidebarListItem">
                                    <TrendingDown className="sidebarIcon"/>
                                    <div className="sidebarIconName">Purchases</div>
                                </li>
                            </Link>
                        </div>
                        <div className="sidebarListContainer">
                            <Link to="/revenue" className="link sidebarListContainer">
                                <li className="sidebarListItem">
                                    <Paid className="sidebarIcon"/>
                                    <div className="sidebarIconName">Revenue</div>
                                </li>
                            </Link>
                        </div>
                    </ul>
                </div>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Users</h3>
                    <ul className="sidebarList">
                        <div className="sidebarListContainer">
                            <Link to="/users" className="link sidebarListContainer">
                                <li className="sidebarListItem">
                                    <PermIdentity className="sidebartIcon"/>
                                    <div className="sidebarIconName">Users Info</div>
                                </li>
                            </Link>
                        </div>
                    </ul>  
                </div>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Notifications</h3>
                    <ul className="sidebarList">
                        <div className="sidebarListContainer">
                            <Link to="/feedbacks" className="link sidebarListContainer">
                                <li className="sidebarListItem">
                                    <PermIdentity className="sidebartIcon"/>
                                    <div className="sidebarIconName">Feedbacks</div>
                                </li>
                            </Link>
                        </div>
                    </ul>  
                </div>
            </div>
        </div>
    )
}