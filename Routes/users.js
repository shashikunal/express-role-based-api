const router = require("express").Router();
const {
  userRegister,
  userLogin,
  userAuth,
  serializeUser,
  checkRole,
} = require("../Authproviders/auth");

/*--------------------------------Users Registration Route -------------------------------*/
router.post("/register-user", async (req, res) => {
  await userRegister(req.body, "users", res);
});
/*--------------------------------admin Registration Route -------------------------------*/
router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});
/*--------------------------------super admin Registration Route -------------------------------*/
router.post("/register-super-admin", async (req, res) => {
  await userRegister(req.body, "superadmin", res);
});

/*--------------------------------Users Login Route -------------------------------*/
router.post("/login-user", async (req, res) => {
  await userLogin(req.body, "users", res);
});
/*--------------------------------admin Login Route -------------------------------*/
router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});
/*--------------------------------super Admin Login Route -------------------------------*/
router.post("/login-super-admin", async (req, res) => {
  await userLogin(req.body, "superadmin", res);
});

/*--------------------------------Users Protected Route -------------------------------*/

router.get("/profile", userAuth, async (req, res) => {
  return res.status(201).json(serializeUser(req.user));
});

router.get(
  "/user-protected",
  userAuth,
  checkRole(["users"]),
  async (req, res) => {
    return res.json("hello users");
  }
);
/*--------------------------------admin Protected Route -------------------------------*/
router.get(
  "/admin-protected",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json("hello admin");
  }
);
/*--------------------------------super admin Protected Route -------------------------------*/
router.get(
  "/super-admin-protected",
  userAuth,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json("hello super admin");
  }
);
router.get(
  "/adminandsuperadmin",
  userAuth,
  checkRole(["superadmin", "admin"]),
  async (req, res) => {
    return res.json("hello super and admin");
  }
);

module.exports = router;
