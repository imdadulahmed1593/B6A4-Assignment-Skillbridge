import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect with Expert Tutors, Learn Anything
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Find the perfect tutor for any subject. Book sessions instantly
              and start learning today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/tutors"
                className="btn-primary text-center text-lg px-8 py-3"
              >
                Find a Tutor
              </Link>
              <Link
                href="/register"
                className="btn bg-white text-primary-600 hover:bg-primary-50 text-center text-lg px-8 py-3"
              >
                Become a Tutor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose SkillBridge?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Expert Tutors</h3>
              <p className="text-secondary-600">
                Learn from verified experts with proven experience in their
                fields.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">
                Flexible Scheduling
              </h3>
              <p className="text-secondary-600">
                Book sessions that fit your schedule. Learn at your own pace.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
              <p className="text-secondary-600">
                Read authentic reviews from real students before booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "📐 Mathematics",
              "💻 Programming",
              "🌍 Languages",
              "🔬 Science",
              "🎵 Music",
              "📈 Business",
            ].map((category) => (
              <Link
                key={category}
                href="/tutors"
                className="card p-4 text-center hover:border-primary-500 border-2 border-transparent transition-all"
              >
                <span className="text-lg">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning with
            SkillBridge.
          </p>
          <Link
            href="/register"
            className="btn bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-3"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
